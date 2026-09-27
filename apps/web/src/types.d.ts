export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK'

export type Product = {
    id: number
    sku: string
    name: string
    category: string
    priceInCents: number
    stock: number
    status: ProductStatus
}

export type ProductFilters = {
    search?: string
    category?: string
    status?: 'all' | 'active' | 'inactive' | 'out_of_stock'
    inStock?:
     'all' | 'true' | 'false'
}
export type GetProductsParams = ProductFilters & {
    page?: number
    limit?: number
    sort?: 'name' | 'price' | 'stock' | 'recent' | 'category'
    order?: 'asc' | 'desc'
}

export type ProductsPagination = {
    page: number
    limit: number
    total: number
    totalPages: number
}

export type GetProductsResponse = {
    data: Product[]
    pagination: ProductsPagination
}
