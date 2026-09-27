import type { HTMLAttributes, ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { twMerge } from 'tailwind-merge'

const alertVariants = tv({
    base: 'flex gap-2.5 rounded-md border px-3.5 py-3 text-small',
    variants: {
        variant: {
            error: 'border-danger/35 bg-tint-danger text-danger',
            success: 'border-success/35 bg-tint-success text-accent-text',
            warning: 'border-warning/35 bg-tint-warning text-text-2',
            info: 'border-info/35 bg-surface-raised text-text-2',
        },
    },
    defaultVariants: {
        variant: 'error',
    },
})

type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> &
    VariantProps<typeof alertVariants> & {
        title?: string
        icon?: ReactNode
    }

export function Alert({
    className,
    variant,
    title,
    icon,
    children,
    ...props
}: AlertProps) {
    return (
        <div
            {...props}
            role={props.role ?? 'alert'}
            className={twMerge(alertVariants({ variant }), className)}
        >
            {icon && <span className="mt-0.5 shrink-0">{icon}</span>}
            <div className="min-w-0">
                {title && <strong className="block font-semibold">{title}</strong>}
                {children && <div className="text-text-muted">{children}</div>}
            </div>
        </div>
    )
}
