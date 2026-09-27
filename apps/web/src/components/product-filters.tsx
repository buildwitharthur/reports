import { debounce, useQueryStates } from 'nuqs'

import { productQueryParams } from '../lib/product-query-params'
import { FilterSelect } from './filter-select'
import { ProductSearch } from './product-search'

const sortValues = ['name', 'price', 'stock', 'recent', 'category'] as const
const orderValues = ['asc', 'desc'] as const

const categoryOptions = [
    { value: 'all', label: 'Categoria: Todas' },
    { value: 'notebooks', label: 'Categoria: Notebooks' },
    { value: 'monitores', label: 'Categoria: Monitores' },
    { value: 'teclados', label: 'Categoria: Teclados' },
    { value: 'mouses', label: 'Categoria: Mouses' },
    { value: 'headsets', label: 'Categoria: Headsets' },
    { value: 'armazenamento', label: 'Categoria: Armazenamento' },
    { value: 'memoria', label: 'Categoria: Memória' },
    { value: 'placas-de-video', label: 'Categoria: Placas de vídeo' },
    { value: 'acessorios', label: 'Categoria: Acessórios' },
] as const

const statusOptions = [
    { value: 'all', label: 'Status: Todos' },
    { value: 'active', label: 'Status: Ativos' },
    { value: 'inactive', label: 'Status: Inativos' },
    { value: 'out_of_stock', label: 'Status: Sem estoque' },
] as const

const inStockOptions = [
    { value: 'all', label: 'Estoque: Todos' },
    { value: 'true', label: 'Estoque: Disponível' },
    { value: 'false', label: 'Estoque: Sem estoque' },
] as const

const sortOptions = [
    { value: 'name-asc', label: 'Ordenar: Nome' },
    { value: 'name-desc', label: 'Ordenar: Nome (Z-A)' },
    { value: 'price-asc', label: 'Ordenar: Menor preço' },
    { value: 'price-desc', label: 'Ordenar: Maior preço' },
    { value: 'stock-asc', label: 'Ordenar: Menor estoque' },
    { value: 'stock-desc', label: 'Ordenar: Maior estoque' },
    { value: 'recent-desc', label: 'Ordenar: Mais recentes' },
    { value: 'recent-asc', label: 'Ordenar: Mais antigos' },
    { value: 'category-asc', label: 'Ordenar: Categoria' },
    { value: 'category-desc', label: 'Ordenar: Categoria (Z-A)' },
] as const

type ProductFiltersProps = {
    className?: string
}

export function ProductFilters({ className }: ProductFiltersProps) {
    const [params, setParams] = useQueryStates(productQueryParams, {
        history: 'replace',
        clearOnDefault: true,
    })

    const sortValue = `${params.sort}-${params.order}`

    const handleSearchChange = (search: string) => {
        setParams(
            {
                search,
                page: 1,
            },
            {
                limitUrlUpdates: debounce(400),
            },
        )
    }

    return (
        <div className={`flex flex-wrap gap-2 ${className ?? ''}`}>
            <ProductSearch
                value={params.search}
                onValueChange={handleSearchChange}
            />

            <FilterSelect
                ariaLabel="Categoria"
                options={categoryOptions}
                value={params.category}
                onValueChange={(category) => {
                    void setParams({ category, page: 1 })
                }}
            />

            <FilterSelect
                ariaLabel="Status"
                options={statusOptions}
                value={params.status}
                onValueChange={(status) => {
                    void setParams({ status, page: 1 })
                }}
            />

            <FilterSelect
                ariaLabel="Estoque"
                options={inStockOptions}
                value={params.inStock}
                onValueChange={(inStock) => {
                    void setParams({ inStock, page: 1 })
                }}
            />

            <FilterSelect
                ariaLabel="Ordenação"
                options={sortOptions}
                value={sortValue}
                onValueChange={(selectedValue) => {
                    const [sort, order] = selectedValue.split('-') as [
                        (typeof sortValues)[number],
                        (typeof orderValues)[number],
                    ]

                    void setParams({ sort, order, page: 1 })
                }}
            />
        </div>
    )
}
