import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useQueryStates } from 'nuqs'

import { productQueryParams } from '../lib/product-query-params'

import { IconButton } from './ui/icon-button'

type ProductsPaginationProps = {
    pagination: ProductsPagination
    disabled?: boolean
}

type PageItem = number | 'ellipsis'

const numberFormatter = new Intl.NumberFormat('pt-BR')

function getVisiblePages(currentPage: number, totalPages: number): PageItem[] {
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    const pages = new Set<number>([1, totalPages, currentPage])

    if (currentPage > 1) pages.add(currentPage - 1)
    if (currentPage < totalPages) pages.add(currentPage + 1)

    const sortedPages = [...pages].sort((first, second) => first - second)
    const visiblePages: PageItem[] = []

    sortedPages.forEach((page, index) => {
        const previousPage = sortedPages[index - 1]

        if (previousPage !== undefined && page - previousPage > 1) {
            visiblePages.push('ellipsis')
        }

        visiblePages.push(page)
    })

    return visiblePages
}

export function ProductsPagination({
    pagination,
    disabled = false,
}: ProductsPaginationProps) {
    const [params, setParams] = useQueryStates(productQueryParams, {
        history: 'replace',
        clearOnDefault: true,
    })

    const currentPage = params.page
    const { limit, total, totalPages } = pagination
    const start = (currentPage - 1) * limit + 1
    const end = Math.min(currentPage * limit, total)
    const visiblePages = getVisiblePages(currentPage, totalPages)

    const handlePageChange = (nextPage: number) => {
        if (
            disabled ||
            nextPage < 1 ||
            nextPage > totalPages ||
            nextPage === currentPage
        ) {
            return
        }

        void setParams({ page: nextPage })
    }

    return (
        <div className="flex flex-col items-start justify-between gap-3 text-small sm:flex-row sm:items-center">
            <p className="text-text-muted">
                Mostrando{' '}
                <span className="font-medium text-text">
                    {numberFormatter.format(start)}–
                    {numberFormatter.format(end)}
                </span>{' '}
                de{' '}
                <span className="font-medium text-text">
                    {numberFormatter.format(total)}
                </span>{' '}
                produtos
            </p>

            <nav
                aria-label="Paginação de produtos"
                className="flex items-center gap-1"
            >
                <IconButton
                    type="button"
                    aria-label="Página anterior"
                    disabled={disabled || currentPage <= 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    <ChevronLeft size={16} aria-hidden="true" />
                </IconButton>

                {visiblePages.map((page, index) =>
                    page === 'ellipsis' ? (
                        <span
                            key={`ellipsis-${index}`}
                            className="grid size-8 place-items-center text-text-muted"
                            aria-hidden="true"
                        >
                            …
                        </span>
                    ) : (
                        <button
                            key={page}
                            type="button"
                            aria-current={
                                page === currentPage ? 'page' : undefined
                            }
                            disabled={disabled}
                            onClick={() => handlePageChange(page)}
                            className={`grid size-8 place-items-center rounded-sm text-small transition-colors focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-text disabled:cursor-not-allowed ${
                                page === currentPage
                                    ? 'border border-line bg-surface text-text'
                                    : 'text-text-muted hover:bg-surface-raised hover:text-text'
                            }`}
                        >
                            {page}
                        </button>
                    ),
                )}

                <IconButton
                    type="button"
                    aria-label="Próxima página"
                    disabled={disabled || currentPage >= totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    <ChevronRight size={16} aria-hidden="true" />
                </IconButton>
            </nav>
        </div>
    )
}
