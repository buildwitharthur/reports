import type { HTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { twMerge } from 'tailwind-merge'

const badgeVariants = tv({
    base: 'inline-flex h-[22px] items-center gap-1.5 rounded-pill px-[9px] pl-2 text-[12px] leading-none font-medium whitespace-nowrap text-text-2',
    variants: {
        variant: {
            success: 'bg-tint-success before:bg-brand-500',
            warning: 'bg-tint-warning text-text-2 before:bg-warning',
            neutral: 'bg-tint-neutral before:bg-text-subtle',
            danger: 'bg-tint-danger text-danger before:bg-danger',
        },
    },
    defaultVariants: {
        variant: 'neutral',
    },
})

type BadgeProps = HTMLAttributes<HTMLSpanElement> &
    VariantProps<typeof badgeVariants>

export function Badge({ className, variant, children, ...props }: BadgeProps) {
    return (
        <span
            {...props}
            className={twMerge(
                badgeVariants({ variant }),
                'before:size-1.5 before:shrink-0 before:rounded-full before:content-[""]',
                className,
            )}
        >
            {children}
        </span>
    )
}
