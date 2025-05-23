import { isRouteErrorResponse, Link, Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { Text } from "@/components/text";

import type { Route } from "./+types/root";
import { DEFAULT_REGION, getCountryCode, getRegionMap } from "./utils/regions";
import { ArrowUpRightMini } from "@medusajs/icons";
import globalStylesheet from "./styles/globals.css?url";
import readonlyStylesheet from "./styles/readonly.css?url";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { logServerError } from "./lib/error-process-server";
import { reportClientError } from "./lib/error-process-client";
import { ThemeProvider } from "@/context/theme-provider";

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: globalStylesheet },
  { rel: "stylesheet", href: readonlyStylesheet },
  { rel: "icon", href: "/favicon.ico" },
];

export const meta: Route.MetaDescriptors = [
  {
    title: "Shopable Starter",
  },
];

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const search = url.search;
  const protocol = request.headers.get("x-forwarded-proto") || url.protocol;
  const host = request.headers.get("x-forwarded-host") || url.host;
  const origin = `${protocol + protocol.endsWith(":") ? "" : ":"}//${host}`;

  if (pathname.includes(".") && !pathname.endsWith(".html")) {
    return null;
  }

  try {
    const regionMap = await getRegionMap();

    if (!regionMap || regionMap.size === 0) {
      console.error("Cannot proceed without region map.");
      return { countryCode: DEFAULT_REGION, regionMap };
    }

    const countryCode = await getCountryCode(request, regionMap);

    if (!countryCode) {
      console.error("Could not determine country code.");
      throw new Error("Failed to determine a valid country code.");
    }

    const urlHasCountryCode = pathname.toLowerCase().startsWith(`/${countryCode}`);

    // Case 1: Correct country code in URL -> Proceed
    if (urlHasCountryCode) {
      return { countryCode, regionMap }; // Pass data down
    }

    // Case 3: Incorrect or missing country code in URL -> Redirect to correct URL
    if (!urlHasCountryCode) {
      const correctPathname = `/${countryCode}${pathname === "/" ? "" : pathname}`;
      const redirectUrl = `${origin}${correctPathname}${search}`;

      return redirect(redirectUrl, { status: 307 });
    }

    return { countryCode, regionMap }; // Proceed
  } catch (error) {
    console.error("Error in root loader:", error);
    // Re-throw the error so the ErrorBoundary catches it
    throw error;
  }
};

export function Layout({ children }: { children: React.ReactNode }) {
  // This script runs immediately to set the theme before React hydration, preventing FOUC.
  const themeScript = `
    (function() {
      try {
        let theme = localStorage.getItem('shopable-theme');
        // If theme is explicitly 'light' or 'dark', use that.
        // Otherwise (if 'system', null, or invalid), determine from system preference.
        if (theme !== 'light' && theme !== 'dark') {
          if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            theme = 'dark';
          } else {
            theme = 'light';
          }
        }

        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {
        // If any error occurs (e.g., localStorage is disabled),
        // it will default to light mode or whatever the CSS specifies without 'dark' class.
        // The ThemeProvider will still run later to apply the correct theme.
        console.warn('Initial theme script failed, relying on ThemeProvider for full theme application.', e);
      }
    })();
  `;

  return (
    <html lang="en"> {/* The 'dark' class will be managed by the script and ThemeProvider */}
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {/* Embed the theme script directly into the head */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {import.meta.env.DEV && <script crossOrigin="anonymous" src="//unpkg.com/shopable-scan/dist/auto.global.js" />}
      </head>
      <body className="bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
        <ThemeProvider storageKey="shopable-theme" defaultTheme="system">
          <TooltipProvider>{children}</TooltipProvider>
          <ScrollRestoration />
          <Scripts />
        </ThemeProvider>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let _message = "Oops!";
  let details = "An unexpected error occurred.";
  let _stack: string | undefined;

  if (SHOPABLE_DEV_SERVER === "true" && import.meta.env.DEV) {
    if (typeof window === "undefined") {
      logServerError(error);
    } else {
      reportClientError(error);
    }
  }

  if (isRouteErrorResponse(error)) {
    _message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    _stack = error.stack;
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl-semi text-neutral-800 dark:text-neutral-100">{_message}</h1>
      <p className="text-small-regular text-neutral-700 dark:text-neutral-300">{details}</p>
      <Link className="flex gap-x-1 items-center group" to="/">
        <Text className="text-sky-600 dark:text-sky-400">Go to frontpage</Text>
        <ArrowUpRightMini className="group-hover:rotate-45 ease-in-out duration-150" color="currentColor" />
      </Link>
      {_stack && (
        <pre className="text-small-regular text-gray-500 dark:text-neutral-500 max-w-[600px] overflow-x-auto">
          {import.meta.env.DEV ? _stack : "Stack trace is hidden in production."}
        </pre>
      )}
    </div>
  );
}