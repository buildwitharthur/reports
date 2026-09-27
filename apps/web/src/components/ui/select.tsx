import { ChevronDown } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>

export function Select({ className, children, ...props }: SelectProps) {
    return (
        <div className="relative w-fit">
            <select
                className={twMerge(
                    'h-9 w-fit appearance-none rounded-md border border-line bg-surface px-3 pr-8 text-small text-text outline-none transition-colors',
                    'hover:bg-surface-raised',
                    'focus:border-line-strong',
                    className,
                )}
                {...props}
            >
                {children}
            </select>

            <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-text-muted"
            />
        </div>
    )
}
