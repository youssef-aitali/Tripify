import { Button as ShadCNButton, type ButtonProps } from "@/components/ui/button";

interface CustomButtonProps extends ButtonProps; 

export function Button({ ...props }) {
  return (
    <ShadCNButton 
      className={`custom-class ${className}`} 
      {...props} 
    />
  );
}