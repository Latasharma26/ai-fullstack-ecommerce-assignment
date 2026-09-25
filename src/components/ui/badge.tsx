import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold uppercase tracking-[1.5px] font-bison transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#00D5FD]/10 text-slate-700 border border-[#00D5FD]/20",
        secondary: "bg-[#2A1850]/10 text-[#2A1850] border border-[#2A1850]/20",
        solidCyan: "bg-[#00D5FD] text-white",
        outline: "text-slate-600 border border-slate-300",
        glass: "bg-white/80 backdrop-blur-md text-slate-900 border border-white/40 shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
