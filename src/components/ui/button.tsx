import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-[2px] font-bison cursor-pointer active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-[#00D5FD] hover:bg-[#02D3FC] text-white shadow-md hover:shadow-cyan-400/25",
        outline: "border border-[#00D5FD] text-[#00D5FD] bg-[#00D5FD]/5 hover:bg-[#00D5FD] hover:text-white",
        secondary: "bg-[#2A1850] text-white hover:bg-[#3b236e]",
        ghost: "hover:bg-slate-100 text-slate-800",
        link: "text-[#00D5FD] underline-offset-4 hover:underline",
        white: "bg-white text-[#040C1E] hover:bg-slate-100 shadow-md",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-14 rounded-xl px-8 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
