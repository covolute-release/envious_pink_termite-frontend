import { Container } from "@/components/container";
import { cn } from "@/lib/utils";
import type React from "react";
import { useState } from "react"; // Removed useCallback, useEffect
// Removed useEmblaCarousel and Chevron icon imports

import PlaceholderImage from "@/modules/common/icons/placeholder-image";

type ThumbnailProps = {
  thumbnail?: string | null;
  images?: { url: string; id?: string }[] | null; // Updated images prop type to be more specific
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
  const [isHovered, setIsHovered] = useState(false);

  const allImages = [
    thumbnail,
    ...(images?.map(img => img.url) || [])
  ]
    .filter(Boolean) // Remove null or undefined
    .filter((value, index, self) => self.indexOf(value as string) === index); // Remove duplicates, ensure value is string for indexOf

  const hasMultipleImages = allImages.length > 1;

  const imageSizesAttribute = "(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px";

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
      onMouseEnter={() => {
        if (hasMultipleImages) {
          setIsHovered(true);
        }
      }}
      onMouseLeave={() => {
        if (hasMultipleImages) {
          setIsHovered(false);
        }
      }}
    >
      {hasMultipleImages && allImages[0] && allImages[1] ? (
        <>
          {/* First image (default) */}
          <img
            src={allImages[0]}
            alt="Product image 1"
            className={cn(
              "absolute inset-0 object-cover object-center w-full h-full rounded-large transition-all duration-300 ease-in-out",
              {
                "transform translate-y-0 opacity-100": !isHovered,
                "transform -translate-y-full opacity-0": isHovered, // Scrolls up and out
              }
            )}
            draggable={false}
            loading="lazy"
            sizes={imageSizesAttribute}
          />
          {/* Second image (on hover) */}
          <img
            src={allImages[1]}
            alt="Product image 2"
            className={cn(
              "absolute inset-0 object-cover object-center w-full h-full rounded-large transition-all duration-300 ease-in-out",
              {
                "transform translate-y-full opacity-0": !isHovered, // Starts below and hidden
                "transform translate-y-0 opacity-100": isHovered,   // Scrolls in to view
              }
            )}
            draggable={false}
            loading="lazy"
            sizes={imageSizesAttribute}
          />
        </>
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
    <div className="w-full h-full absolute inset-0 flex items-center justify-center p-4">
      <PlaceholderImage size={size === "small" ? 16 : 24} />
    </div>
  );
};

export default Thumbnail;