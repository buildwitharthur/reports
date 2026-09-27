import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

type SpinnerProps = ComponentProps<'span'>

export function Spinner({ className, ...props }: SpinnerProps) {
    return (
        <span
            {...props}
            aria-hidden={props['aria-hidden'] ?? true}
            className={twMerge(
                'inline-block size-3.5 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent',
                className,
            )}
        />
    )
}
