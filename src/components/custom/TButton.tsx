import type { ComponentProps } from "react";
import { Button as ShadCNButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonProps = ComponentProps<typeof ShadCNButton>;

const TButton = ({ className, variant, ...props }: ButtonProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault(); // Block space bar
    }
    props.onKeyDown?.(e); // Preserve existing onKeyDown
  };

  return (
    <ShadCNButton
      variant={variant}
      className={cn(
        "cursor-pointer",
        variant === "link" && "p-0 hover:underline font-normal h-[14px]",
        variant === "ghost" && "hover:bg-gray-200/50",
        variant !== "link" &&
          variant !== "ghost" &&
          "bg-tprimary hover:bg-tprimary-hover text-white",
        className
      )}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
};

export default TButton;
