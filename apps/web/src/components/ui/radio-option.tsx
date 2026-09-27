import type { ComponentProps, ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { twMerge } from 'tailwind-merge'

const radioOptionVariants = tv({
    base: [
        'flex cursor-pointer items-start gap-3 rounded-md border border-line px-3.5 py-3',
        'transition-colors hover:border-line-strong',
        'has-[:checked]:border-line-strong has-[:checked]:bg-surface-raised',
        'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-text',
    ],
    variants: {
        disabled: {
            true: 'cursor-not-allowed opacity-60 hover:border-line',
        },
    },
})

type RadioOptionProps = Omit<
    ComponentProps<'input'>,
    'type' | 'className' | 'children' | 'title'
> &
    VariantProps<typeof radioOptionVariants> & {
        title: string
        description?: ReactNode
        className?: string
    }

export function RadioOption({
    title,
    description,
    className,
    disabled,
    ...props
}: RadioOptionProps) {
    return (
        <label
            className={twMerge(
                radioOptionVariants({ disabled: disabled || undefined }),
                className,
            )}
        >
            <input
                {...props}
                type="radio"
                disabled={disabled}
                className="mt-0.5 size-4 shrink-0 accent-brand-600"
            />
            <span className="flex min-w-0 flex-col">
                <span className="font-medium text-text">{title}</span>
                {description && (
                    <span className="text-small text-text-muted">
                        {description}
                    </span>
                )}
            </span>
        </label>
    )
}
