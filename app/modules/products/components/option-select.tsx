import type { HttpTypes } from "@medusajs/types";
import { cn } from "@/lib/utils";
import type React from "react";

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption;
  current: string | undefined;
  updateOption: (title: string, value: string) => void;
  title: string;
  disabled: boolean;
  "data-testid"?: string;
};

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value);

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm text-neutral-700 dark:text-neutral-300">Select {title}</span>
      <div className="flex flex-wrap justify-between gap-2" data-testid={dataTestId}>
        {filteredOptions.map((v) => {
          return (
            <button
              onClick={() => updateOption(option.id, v)}
              key={v}
              className={cn(
                "border bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 text-neutral-800 dark:text-neutral-200 text-small-regular h-10 rounded-rounded p-2 flex-1 ",
                {
                  "border-sky-500 dark:border-sky-500 ring-1 ring-sky-500": v === current,
                  "hover:shadow-elevation-card-rest transition-shadow ease-in-out duration-150": v !== current,
                },
              )}
              disabled={disabled}
              data-testid="option-button"
            >
              {v}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OptionSelect;