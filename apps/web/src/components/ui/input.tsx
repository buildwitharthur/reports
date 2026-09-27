import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

type InputProps = ComponentProps<'input'>

export function Input({ className, ...props }: InputProps) {
    return (
        <input
            {...props}
            className={twMerge(
                'h-9 rounded-md border border-line bg-surface px-3 text-small text-text outline-none transition-colors',
                'placeholder:text-text-subtle hover:border-line-strong',
                'focus:border-brand-600 focus:shadow-[var(--shadow-focus)]',
                'disabled:cursor-not-allowed disabled:bg-surface-raised disabled:text-text-muted',
                className,
            )}
        />
    )
}
