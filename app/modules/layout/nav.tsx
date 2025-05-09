import { Suspense } from "react";

import type { StoreRegion } from "@medusajs/types";
import CartButton from "@/modules/layout/components/cart-button";
import SideMenu from "@/modules/layout/components/side-menu";
import { Link } from "@remix-run/react";

export default function Nav({ regions }: { regions: StoreRegion[] }) {
  const logoUrl = "https://firebasestorage.googleapis.com/v0/b/shopable-60057.firebasestorage.app/o/stores%2F8756da28-3f06-4185-b5a1-5e7dbe937d38%2Fimages%2Fgenerated-8b052a0e-447a-40f3-b36d-13d837b14dd5.png?alt=media";
  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b duration-200 bg-ui-bg-component border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu regions={regions} />
            </div>
          </div>

          <div className="flex items-center h-full">
            <Link
              to="/"
              className="txt-compact-xlarge-plus hover:text-ui-fg-interactive uppercase flex items-center gap-x-2 text-ui-fg-base"
              data-testid="nav-store-link"
            >
              <img src={logoUrl} alt="Catalyst Pets Logo" className="h-8 w-auto" />
              Catalyst Pets
            </Link>
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <Link className="hover:text-ui-fg-interactive text-ui-fg-base" to="/account" data-testid="nav-account-link">
                Account
              </Link>
            </div>
            <Suspense
              fallback={
                <Link className="hover:text-ui-fg-interactive text-ui-fg-base flex gap-2" to="/cart" data-testid="nav-cart-link">
                  Cart (0)
                </Link>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  );
}