import type { ComponentProps } from "react";
import { Button as ShadCNButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonProps = ComponentProps<typeof ShadCNButton>;

export function Button({ className, variant, ...props }: ButtonProps) {
  return (
    <ShadCNButton
      variant={variant}
      className={cn(
        "cursor-pointer",
        variant !== "link" &&
          "w-full bg-cyan-900/90 hover:bg-cyan-900 hover:text-white",
        variant === "link" && "underline cursor-pointer p-0 text-primary",
        className
      )}
      {...props}
    />
  );
}
