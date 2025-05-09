import { Text } from "@/components/text";
import { getProductPrice } from "@/lib/util/get-product-price";
import type { HttpTypes } from "@medusajs/types";
import { Link } from "@remix-run/react";
import Thumbnail from "./thumbnail";
import PreviewPrice from "./price";

export default function ProductPreview({
  product,
  isFeatured,
}: {
  product: HttpTypes.StoreProduct;
  isFeatured?: boolean;
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  });

  return (
    <Link to={`/products/${product.handle}`} className="group">
      <div data-testid="product-wrapper">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          isFeatured={isFeatured}
          productTitle={product.title} // Pass product title for alt text
        />
        <div className="flex txt-compact-medium mt-4 justify-between">
          <Text className="text-ui-fg-subtle truncate" data-testid="product-title"> {/* Added truncate class */}
            {product.title}
          </Text>
          <div className="flex items-center gap-x-2">{cheapestPrice && <PreviewPrice price={cheapestPrice} />}</div>
        </div>
      </div>
    </Link>
  );
}