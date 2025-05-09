import type { HttpTypes } from "@medusajs/types";
import { Heading } from "@/components/heading";
import { Text } from "@/components/text";
import { Link } from "@remix-run/react";

type ProductInfoProps = {
  product: HttpTypes.StoreProduct;
};

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
        {product.collection && (
          <Link
            to={`/collections/${product.collection.handle}`}
            className="text-medium text-neutral-600 dark:text-neutral-400 hover:text-sky-600 dark:hover:text-sky-400"
          >
            {product.collection.title}
          </Link>
        )}
        <Heading level="h2" className="text-3xl leading-10 text-neutral-800 dark:text-neutral-100" data-testid="product-title">
          {product.title}
        </Heading>

        <Text className="text-medium text-neutral-700 dark:text-neutral-300 whitespace-pre-line" data-testid="product-description">
          {product.description}
        </Text>
      </div>
    </div>
  );
};

export default ProductInfo;