import type { ComponentProps } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { twMerge } from 'tailwind-merge'

import { Spinner } from './spinner'

const buttonVariants = tv({
    base: [
        'inline-flex items-center justify-center gap-2',
        'h-9 rounded-pill border px-4',
        'text-[14px] leading-5 font-medium whitespace-nowrap',
        'transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text',
        'disabled:cursor-not-allowed disabled:border-line disabled:bg-surface-raised disabled:text-text-muted',
    ],
    variants: {
        variant: {
            primary:
                'border-transparent bg-brand-500 text-on-brand hover:bg-brand-600',
            secondary:
                'border-line bg-surface text-text-2 hover:border-line-strong hover:text-text',
        },
        size: {
            sm: 'h-8 px-3 ',
            md: 'h-9 px-4 text-[14px] leading-5',
            lg: 'h-11 px-5 ',
        },
    },
    defaultVariants: {
        variant: 'primary',
        size: 'md',
    },
})

type ButtonProps = ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        loading?: boolean
    }

export function Button({
    children,
    className,
    variant,
    size,
    loading = false,
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            {...props}
            className={twMerge(buttonVariants({ variant, size }), className)}
            disabled={disabled || loading}
            aria-busy={loading || undefined}
        >
            {loading && <Spinner className="size-3.5" />}
            {children}
        </button>
    )
}
