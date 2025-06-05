import type { ComponentProps } from "react";
import { Button as ShadCNButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonProps = ComponentProps<typeof ShadCNButton>;

const TButton = ({ className, variant, ...props }: ButtonProps) => {
  return (
    <ShadCNButton
      variant={variant}
      className={cn(
        "cursor-pointer",
        variant === "link" && "p-0 hover:underline font-normal h-[14px]",
        variant === "ghost" && "hover:bg-gray-200/50",
        variant !== "link" &&
          variant !== "ghost" &&
          "bg-cyan-900/90 hover:bg-cyan-900 text-white",
        className
      )}
      {...props}
    />
  );
};

export default TButton;
