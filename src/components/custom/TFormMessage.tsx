import type { ComponentProps } from "react";
import { FormMessage as ShadCNFormMessage } from "@/components/ui/form";

type ButtonProps = ComponentProps<typeof ShadCNFormMessage>;

const TFormMessage = ({ className, ...props }: ButtonProps) => {
  return <ShadCNFormMessage className="-mt-2" {...props} />;
};

export default TFormMessage;
