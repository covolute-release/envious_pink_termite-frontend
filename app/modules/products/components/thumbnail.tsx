import { Container } from "@/components/container";
import { cn } from "@/lib/utils";
import type React from "react";
import { useState } from "react";

import PlaceholderImage from "@/modules/common/icons/placeholder-image";

type ThumbnailProps = {
  thumbnail?: string | null;
  images?: { url: string; id?: string }[] | null;
  size?: "small" | "medium" | "large" | "full" | "square";
  isFeatured?: boolean;
  className?: string;
  "data-testid"?: string;
  productTitle?: string; // Added productTitle prop
};

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  isFeatured,
  className,
  "data-testid": dataTestid,
  productTitle, // Destructure productTitle
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const allImages = [
    thumbnail,
    ...(images?.map(img => img.url) || [])
  ]
    .filter(Boolean)
    .filter((value, index, self) => self.indexOf(value as string) === index);

  const hasMultipleImages = allImages.length > 1;

  const imageSizesAttribute = "(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px";

  const primaryAltText = productTitle ? `${productTitle} - Main view` : "Product image 1";
  const secondaryAltText = productTitle ? `${productTitle} - Hover view` : "Product image 2";

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
            alt={primaryAltText}
            className={cn(
              "absolute inset-0 object-cover object-center w-full h-full rounded-large transition-all duration-300 ease-in-out",
              {
                "transform translate-y-0 opacity-100": !isHovered,
                "transform -translate-y-full opacity-0": isHovered,
              }
            )}
            draggable={false}
            loading="lazy"
            sizes={imageSizesAttribute}
          />
          {/* Second image (on hover) */}
          <img
            src={allImages[1]}
            alt={secondaryAltText}
            className={cn(
              "absolute inset-0 object-cover object-center w-full h-full rounded-large transition-all duration-300 ease-in-out",
              {
                "transform translate-y-full opacity-0": !isHovered,
                "transform translate-y-0 opacity-100": isHovered,
              }
            )}
            draggable={false}
            loading="lazy"
            sizes={imageSizesAttribute}
          />
        </>
      ) : (
        <ImageOrPlaceholder image={allImages[0]} size={size} productTitle={productTitle} />
      )}
    </Container>
  );
};

const ImageOrPlaceholder = ({ image, size, productTitle }: Pick<ThumbnailProps, "size" | "productTitle"> & { image?: string }) => {
  const singleImageAltText = productTitle || "Product image";
  return image ? (
    <img
      src={image}
      alt={singleImageAltText}
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