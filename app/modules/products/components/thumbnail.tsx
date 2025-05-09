import { Container } from "@/components/container";
import { cn } from "@/lib/utils";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import PlaceholderImage from "@/modules/common/icons/placeholder-image";

type ThumbnailProps = {
  thumbnail?: string | null;
  images?: any[] | null; // TODO: Fix image typings
  size?: "small" | "medium" | "large" | "full" | "square";
  isFeatured?: boolean;
  className?: string;
  "data-testid"?: string;
};

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  isFeatured,
  className,
  "data-testid": dataTestid,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const allImages = [thumbnail, ...(images?.map(img => img.url) || [])]
    .filter(Boolean) // Remove null or undefined
    .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const hasMultipleImages = allImages.length > 1;

  return (
    <Container
      className={cn(
        "relative w-full overflow-hidden p-0 bg-ui-bg-subtle shadow-elevation-card-rest rounded-large group-hover:shadow-elevation-card-hover transition-shadow ease-in-out duration-150",
        className,
        {
          "aspect-[11/14]": isFeatured,
          "aspect-[9/16]": !isFeatured && size !== "square",
          "aspect-[1/1]": size === "square",
          "w-[180px]": size === "small",
          "w-[290px]": size === "medium",
          "w-[440px]": size === "large",
          "w-full": size === "full",
        },
      )}
      data-testid={dataTestid}
    >
      {hasMultipleImages ? (
        <div className="overflow-hidden h-full" ref={emblaRef}>
          <div className="flex h-full">
            {allImages.map((image, index) => (
              <div className="relative flex-[0_0_100%] min-w-0 h-full" key={index}>
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="absolute inset-0 object-cover object-center w-full h-full rounded-large"
                  draggable={false}
                  loading="lazy"
                  sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                />
              </div>
            ))}
          </div>
          <button
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full z-10 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full z-10 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      ) : (
        <ImageOrPlaceholder image={allImages[0]} size={size} />
      )}
    </Container>
  );
};

const ImageOrPlaceholder = ({ image, size }: Pick<ThumbnailProps, "size"> & { image?: string }) => {
  return image ? (
    <img
      src={image}
      alt="Thumbnail"
      className="absolute inset-0 object-cover object-center w-full h-full rounded-large"
      draggable={false}
      loading="lazy"
      sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
    />
  ) : (
    <div className="w-full h-full absolute inset-0 flex items-center justify-center p-4"> {/* Added p-4 here for placeholder */}
      <PlaceholderImage size={size === "small" ? 16 : 24} />
    </div>
  );
};

export default Thumbnail;