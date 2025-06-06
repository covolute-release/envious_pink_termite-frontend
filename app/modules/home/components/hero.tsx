import { Button } from "@/components/button";
import { Heading } from "@/components/heading";
import LocalizedClientLink from "@/modules/common/components/localized-client-link";

const Hero = () => {
  const logoUrl = "https://firebasestorage.googleapis.com/v0/b/shopable-60057.firebasestorage.app/o/stores%2F8756da28-3f06-4185-b5a1-5e7dbe937d38%2Fimages%2Fgenerated-8b052a0e-447a-40f3-b36d-13d837b14dd5.png?alt=media";
  return (
    <div className="h-[75vh] w-full border-b border-gray-200 dark:border-neutral-700 relative bg-gray-50 dark:bg-neutral-900 transition-colors duration-200">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        <img src={logoUrl} alt="Catalyst Pets Logo" className="h-24 w-auto mb-4" />
        <span>
          <Heading level="h1" className="text-3xl leading-10 text-neutral-800 dark:text-neutral-100 font-normal">
            Welcome to Catalyst Pets!
          </Heading>
          <Heading level="h2" className="text-3xl leading-10 text-gray-600 dark:text-neutral-300 font-normal">
            Everything your furry friend desires!
          </Heading>
        </span>
        <LocalizedClientLink to="/store">
          <Button variant="primary" size="large" className="bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 text-white">
            Explore Products
            <span className="ml-2">🐾</span>
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  );
};

export default Hero;