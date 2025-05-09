import { cn } from "@/lib/utils";

import { getProductPrice } from "@/lib/util/get-product-price";
import type { HttpTypes } from "@medusajs/types";

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct;
  variant?: HttpTypes.StoreProductVariant;
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  });

  const selectedPrice = variant ? variantPrice : cheapestPrice;

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-gray-100 dark:bg-neutral-700 animate-pulse" />;
  }

  return (
    <div className="flex flex-col text-neutral-800 dark:text-neutral-200">
      <span
        className={cn("text-xl-semi", {
          "text-sky-600 dark:text-sky-400": selectedPrice.price_type === "sale",
        })}
      >
        {!variant && "From "}
        <span data-testid="product-price" data-value={selectedPrice.calculated_price_number}>
          {selectedPrice.calculated_price}
        </span>
      </span>
      {selectedPrice.price_type === "sale" && (
        <>
          <p>
            <span className="text-neutral-600 dark:text-neutral-400">Original: </span>
            <span
              className="line-through"
              data-testid="original-product-price"
              data-value={selectedPrice.original_price_number}
            >
              {selectedPrice.original_price}
            </span>
          </p>
          <span className="text-sky-600 dark:text-sky-400">-{selectedPrice.percentage_diff}%</span>
        </>
      )}
    </div>
  );
}