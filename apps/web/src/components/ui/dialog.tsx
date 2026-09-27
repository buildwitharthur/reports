import {
    useEffect,
    useId,
    useRef,
    type MouseEvent,
    type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { twMerge } from 'tailwind-merge'

type DialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description?: string
    children: ReactNode
    className?: string
}

export function Dialog({
    open,
    onOpenChange,
    title,
    description,
    children,
    className,
}: DialogProps) {
    const dialogRef = useRef<HTMLDivElement>(null)
    const previousActiveElement = useRef<HTMLElement | null>(null)
    const titleId = useId()
    const descriptionId = useId()

    useEffect(() => {
        if (!open) return

        previousActiveElement.current =
            document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        dialogRef.current?.focus()

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onOpenChange(false)
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = previousOverflow
            previousActiveElement.current?.focus()
        }
    }, [onOpenChange, open])

    if (!open) return null

    const handleBackdropMouseDown = (event: MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) onOpenChange(false)
    }

    return createPortal(
        <div
            className="fixed inset-0 z-50 grid place-items-center bg-scrim p-6"
            onMouseDown={handleBackdropMouseDown}
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={description ? descriptionId : undefined}
                tabIndex={-1}
                className={twMerge(
                    'max-h-[calc(100dvh-3rem)] w-full max-w-[460px] overflow-auto rounded-lg border border-line bg-surface p-6 text-text shadow-[var(--shadow-modal)] outline-none',
                    className,
                )}
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 id={titleId} className="text-heading">
                            {title}
                        </h2>
                        {description && (
                            <p id={descriptionId} className="mt-1 text-small text-text-muted">
                                {description}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        aria-label="Fechar"
                        className="-mr-2 -mt-2 inline-grid size-8 place-items-center rounded-sm text-xl leading-none text-text-muted hover:bg-surface-raised hover:text-text focus-visible:outline-2 focus-visible:outline-text"
                        onClick={() => onOpenChange(false)}
                    >
                        ×
                    </button>
                </div>
                <div className="mt-5">{children}</div>
            </div>
        </div>,
        document.body,
    )
}
