import type { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

type SkeletonProps = HTMLAttributes<HTMLDivElement>

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            {...props}
            aria-hidden={props['aria-hidden'] ?? true}
            className={twMerge(
                'animate-pulse rounded-sm bg-surface-raised',
                className,
            )}
        />
    )
}
