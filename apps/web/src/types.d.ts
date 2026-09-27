type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK'

type Product = {
    id: number
    sku: string
    name: string
    category: string
    priceInCents: number
    stock: number
    status: ProductStatus
}

type ProductFilters = {
    search?: string
    category?: string
    status?: 'all' | 'active' | 'inactive' | 'out_of_stock'
    inStock?:
     'all' | 'true' | 'false'
}
type GetProductsParams = ProductFilters & {
    page?: number
    limit?: number
    sort?: 'name' | 'price' | 'stock' | 'recent' | 'category'
    order?: 'asc' | 'desc'
}

type ProductsPagination = {
    page: number
    limit: number
    total: number
    totalPages: number
}

type GetProductsResponse = {
    data: Product[]
    pagination: ProductsPagination
}
