import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/cn"

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        info: 'border-transparent bg-[#86D9EA] text-[#F3FBFD] hover:bg-[#79C3D3] active:bg-[#6BAEBB] focus:bg-[#65A3B0]',
        danger:
          'border-transparent bg-[#EC3232] text-[#FDEBEB] hover:bg-[#D42D2D] active:bg-[#BD2828] focus:bg-[#B12626]',
        success:
          'border-transparent bg-[#44A96D] text-[#C5E4D2] hover:bg-[#3D9862] active:bg-[#368757] focus:bg-[#296541]',
        warning:
          'border-transparent bg-[#F8EF22] text-[#FDFABA] hover:bg-[#DFD71F] active:bg-[#C6BF1B] focus:bg-[#57540C]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
