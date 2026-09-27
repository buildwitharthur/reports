import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useQueryStates } from 'nuqs'

import { getProducts } from '../http/get-products'
import { productQueryParams } from '../lib/product-query-params'
import { Alert } from './ui/alert'
import { ProductsPagination } from './products-pagination'
import { ProductsTable } from './products-table'
import { ProductsTableSkeleton } from './products-table-skeleton'

export function ProductsList() {
    const [params] = useQueryStates(productQueryParams, {
        history: 'replace',
        clearOnDefault: true,
    })

    const query = useQuery({
        queryKey: ['products', params],
        queryFn: () => getProducts(params),
        placeholderData: keepPreviousData,
    })

    if (query.isPending) {
        return <ProductsTableSkeleton />
    }

    if (query.isError) {
        return (
            <Alert
                variant="error"
                title="Não foi possível carregar os produtos."
            >
                {query.error.message}
            </Alert>
        )
    }

    const hasNoProducts = query.data.data.length === 0

    if (hasNoProducts) {
        return (
            <div className="rounded-lg border border-line bg-surface px-4 py-8 text-center text-small text-text-muted">
                Nenhum produto encontrado.
            </div>
        )
    }

    const isUpdating = query.isPlaceholderData || query.isFetching

    return (
        <div className="grid gap-4">
            <div className={isUpdating ? 'opacity-70' : undefined}>
                <ProductsTable products={query.data.data} />
            </div>

            <ProductsPagination
                pagination={query.data.pagination}
                disabled={isUpdating}
            />
        </div>
    )
}
