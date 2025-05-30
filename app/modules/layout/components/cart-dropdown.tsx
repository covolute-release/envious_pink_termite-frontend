import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import { convertToLocale } from "@/lib/util/money";
import type { HttpTypes } from "@medusajs/types";
import { Button } from "@/components/button";
import DeleteButton from "@/modules/common/components/delete-button";
import LineItemOptions from "@/modules/common/components/line-item-options";
import LineItemPrice from "@/modules/common/components/line-item-price";
import Thumbnail from "@/modules/products/components/thumbnail";
import { Fragment, useEffect, useRef, useState } from "react";
import { useLocation, Link } from "@remix-run/react";

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null;
}) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timeout | undefined>(undefined);
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);

  const open = () => setCartDropdownOpen(true);
  const close = () => setCartDropdownOpen(false);

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0) || 0;

  const subtotal = cartState?.subtotal ?? 0;
  const itemRef = useRef<number>(totalItems || 0);

  const timedOpen = () => {
    open();

    const timer = setTimeout(close, 5000);

    setActiveTimer(timer);
  };

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer);
    }

    open();
  };

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer);
      }
    };
  }, [activeTimer]);

  const pathname = useLocation().pathname;

  // open cart dropdown when modifying the cart items, but only if we're not on the cart page
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen();
    }
    itemRef.current = totalItems; // Update ref after check
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, pathname]); // Removed itemRef.current from deps, added pathname

  return (
    <div className="h-full z-50" onMouseEnter={openAndCancel} onMouseLeave={close}>
      <Popover className="relative h-full">
        <PopoverButton className="h-full">
          <Link className="hover:text-sky-600 dark:hover:text-sky-400 text-neutral-800 dark:text-neutral-100" to="/cart" data-testid="nav-cart-link">{`Cart (${totalItems})`}</Link>
        </PopoverButton>
        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <PopoverPanel
            static
            className="hidden small:block absolute top-[calc(100%+1px)] right-0 bg-white dark:bg-neutral-800 border-x border-b border-gray-200 dark:border-neutral-700 w-[420px] text-neutral-800 dark:text-neutral-200 shadow-lg transition-colors duration-200"
            data-testid="nav-cart-dropdown"
          >
            <div className="p-4 flex items-center justify-center">
              <h3 className="text-large-semi text-neutral-800 dark:text-neutral-100">Cart</h3>
            </div>
            {cartState?.items?.length ? (
              <>
                <div className="overflow-y-scroll max-h-[402px] px-4 grid grid-cols-1 gap-y-8 no-scrollbar p-px">
                  {cartState.items
                    .sort((a, b) => {
                      return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1;
                    })
                    .map((item) => (
                      <div className="grid grid-cols-[122px_1fr] gap-x-4" key={item.id} data-testid="cart-item">
                        <Link to={`/products/${item.product_handle}`} className="w-24">
                          <Thumbnail thumbnail={item.thumbnail} images={item.variant?.product?.images} size="square" />
                        </Link>
                        <div className="flex flex-col justify-between flex-1">
                          <div className="flex flex-col flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex flex-col overflow-ellipsis whitespace-nowrap mr-4 w-[180px]">
                                <h3 className="text-base-regular overflow-hidden text-ellipsis">
                                  <Link to={`/products/${item.product_handle}`} data-testid="product-link" className="hover:text-sky-600 dark:hover:text-sky-400 text-neutral-800 dark:text-neutral-100">
                                    {item.title}
                                  </Link>
                                </h3>
                                <LineItemOptions
                                  variant={item.variant}
                                  data-testid="cart-item-variant"
                                  data-value={item.variant}
                                />
                                <span data-testid="cart-item-quantity" data-value={item.quantity} className="text-gray-500 dark:text-neutral-400">
                                  Quantity: {item.quantity}
                                </span>
                              </div>
                              <div className="flex justify-end">
                                <LineItemPrice item={item} style="tight" currencyCode={cartState.currency_code} />
                              </div>
                            </div>
                          </div>
                          <DeleteButton id={item.id} className="mt-1 text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-500" data-testid="cart-item-remove-button">
                            Remove
                          </DeleteButton>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="p-4 flex flex-col gap-y-4 text-small-regular">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-800 dark:text-neutral-200 font-semibold">
                      Subtotal <span className="font-normal">(excl. taxes)</span>
                    </span>
                    <span className="text-large-semi text-neutral-800 dark:text-neutral-100" data-testid="cart-subtotal" data-value={subtotal}>
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cartState.currency_code,
                      })}
                    </span>
                  </div>
                  <Link to="/cart">
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-sky-500 dark:hover:bg-sky-600 text-white" size="large" data-testid="go-to-cart-button">
                      Go to cart
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div>
                <div className="flex py-16 flex-col gap-y-4 items-center justify-center">
                  <div className="bg-gray-900 dark:bg-neutral-700 text-small-regular flex items-center justify-center w-6 h-6 rounded-full text-white dark:text-neutral-200">
                    <span>0</span>
                  </div>
                  <span className="text-gray-500 dark:text-neutral-300">Your shopping bag is empty.</span>
                  <div>
                    <Link to="/store">
                      <>
                        <span className="sr-only">Go to all products page</span>
                        <Button onClick={close} className="bg-blue-500 hover:bg-blue-600 dark:bg-sky-500 dark:hover:bg-sky-600 text-white">Explore products</Button>
                      </>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  );
};

export default CartDropdown;