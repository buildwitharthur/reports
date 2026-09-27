import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

type IconButtonProps = ComponentProps<'button'>

export function IconButton({ className, children, ...props }: IconButtonProps) {
    return (
        <button
            {...props}
            className={twMerge(
                'inline-grid size-8 place-items-center rounded-sm bg-transparent text-text-muted transition-colors',
                'hover:bg-surface-raised hover:text-text disabled:cursor-not-allowed disabled:text-text-subtle',
                'focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-text',
                className,
            )}
        >
            {children}
        </button>
    )
}
