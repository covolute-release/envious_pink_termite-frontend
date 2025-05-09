import { Button } from "@/components/button";
import { Heading } from "@/components/heading";
import LocalizedClientLink from "@/modules/common/components/localized-client-link";

const Hero = () => {
  const logoUrl = "https://firebasestorage.googleapis.com/v0/b/shopable-60057.firebasestorage.app/o/stores%2F8756da28-3f06-4185-b5a1-5e7dbe937d38%2Fimages%2Fgenerated-43e7e4e7-4f1a-43ee-adce-65fe939c8af1.png?alt=media";
  return (
    <div className="h-[75vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        <img src={logoUrl} alt="Catalyst Pets Logo" className="h-24 w-auto mb-4" />
        <span>
          <Heading level="h1" className="text-3xl leading-10 text-ui-fg-base font-normal">
            Welcome to Catalyst Pets!
          </Heading>
          <Heading level="h2" className="text-3xl leading-10 text-ui-fg-subtle font-normal">
            Everything your furry friend desires!
          </Heading>
        </span>
        <LocalizedClientLink to="/store">
          <Button variant="primary" size="large">
            Explore Products
            <span className="ml-2">🐾</span>
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  );
};

export default Hero;