import { type VariantProps, cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import type { HTMLAttributes } from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

const badgeColorVariants = cva("", {
  variants: {
    color: {
      green: "bg-ui-tag-green-bg text-ui-tag-green-text [&_svg]:text-ui-tag-green-icon border-ui-tag-green-border",
      red: "bg-ui-tag-red-bg text-ui-tag-red-text [&_svg]:text-ui-tag-red-icon border-ui-tag-red-border",
      blue: "bg-ui-tag-blue-bg text-ui-tag-blue-text [&_svg]:text-ui-tag-blue-icon border-ui-tag-blue-border",
      orange: "bg-ui-tag-orange-bg text-ui-tag-orange-text [&_svg]:text-ui-tag-orange-icon border-ui-tag-orange-border",
      grey: "bg-ui-tag-neutral-bg text-ui-tag-neutral-text [&_svg]:text-ui-tag-neutral-icon border-ui-tag-neutral-border",
      purple: "bg-ui-tag-purple-bg text-ui-tag-purple-text [&_svg]:text-ui-tag-purple-icon border-ui-tag-purple-border",
    },
  },
  defaultVariants: {
    color: "grey",
  },
});

const badgeSizeVariants = cva("inline-flex items-center gap-x-0.5 border box-border", {
  variants: {
    size: {
      "2xsmall": "txt-compact-xsmall-plus h-5",
      xsmall: "txt-compact-xsmall-plus py-px h-6",
      small: "txt-compact-xsmall-plus py-[3px] h-7",
      base: "txt-compact-small-plus py-[5px] h-8",
      large: "txt-compact-medium-plus py-[7px] h-10",
    },
    rounded: {
      base: "rounded-md",
      full: "rounded-full",
    },
  },
  compoundVariants: [
    {
      size: "2xsmall",
      rounded: "full",
      className: "px-1.5",
    },
    {
      size: "2xsmall",
      rounded: "base",
      className: "px-1",
    },
    {
      size: "xsmall",
      rounded: "full",
      className: "px-2",
    },
    {
      size: "xsmall",
      rounded: "base",
      className: "px-1.5",
    },
    {
      size: "small",
      rounded: "full",
      className: "px-2.5",
    },
    {
      size: "small",
      rounded: "base",
      className: "px-2",
    },
    {
      size: "base",
      rounded: "full",
      className: "px-3",
    },
    {
      size: "base",
      rounded: "base",
      className: "px-2.5",
    },
    {
      size: "large",
      rounded: "full",
      className: "px-3.5",
    },
    {
      size: "large",
      rounded: "base",
      className: "px-3",
    },
  ],
  defaultVariants: {
    size: "base",
    rounded: "base",
  },
});

interface BadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof badgeSizeVariants>,
    VariantProps<typeof badgeColorVariants> {
  asChild?: boolean;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      /**
       * The badge's size.
       */
      size = "base",
      /**
       * The style of the badge's border radius.
       */
      rounded = "base",
      /**
       * The badge's color.
       */
      color = "grey",
      /**
       * Whether to remove the wrapper `span` element and use the
       * passed child element instead.
       */
      asChild = false,
      ...props
    }: BadgeProps,
    ref,
  ) => {
    const Component = asChild ? Slot.Root : "span";

    return (
      <Component
        ref={ref}
        className={cn(badgeColorVariants({ color }), badgeSizeVariants({ size, rounded }), className)}
        {...props}
      />
    );
  },
);
Badge.displayName = "Badge";

export { Badge, badgeColorVariants };
