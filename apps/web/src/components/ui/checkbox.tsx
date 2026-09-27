import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

type CheckboxProps = Omit<ComponentProps<'input'>, 'type'>

export function Checkbox({ className, ...props }: CheckboxProps) {
    return (
        <input
            {...props}
            type="checkbox"
            className={twMerge(
                'size-4 accent-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text disabled:cursor-not-allowed disabled:opacity-60',
                className,
            )}
        />
    )
}
