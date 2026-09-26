import { z } from 'zod'

import type { Prisma } from '../generated/prisma/client.js'

export const productFiltersSchema = z.object({
    search: z.string().trim().default(''),
    category: z.string().trim().default('all'),
    status: z
        .enum(['all', 'active', 'inactive', 'out_of_stock'])
        .default('all'),
    inStock: z.enum(['all', 'true', 'false']).default('all'),
})

export type ProductFilters = z.infer<typeof productFiltersSchema>

export const productStatusMap = {
    active: 'ACTIVE',
    inactive: 'INACTIVE',
    out_of_stock: 'OUT_OF_STOCK',
} as const

export const productCategoryLabels: Record<string, string> = {
    notebooks: 'Notebooks',
    monitores: 'Monitores',
    teclados: 'Teclados',
    mouses: 'Mouses',
    headsets: 'Headsets',
    armazenamento: 'Armazenamento',
    memoria: 'Memória',
    'placas-de-video': 'Placas de vídeo',
    acessorios: 'Acessórios',
}

export const productStatusLabels = {
    ACTIVE: 'Ativo',
    INACTIVE: 'Inativo',
    OUT_OF_STOCK: 'Sem estoque',
} as const

export function buildProductWhere(
    filters: ProductFilters,
): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = {}

    if (filters.search !== '') {
        where.OR = [
            { name: { contains: filters.search, mode: 'insensitive' } },
            { sku: { contains: filters.search, mode: 'insensitive' } },
        ]
    }

    if (filters.category !== 'all') where.category = filters.category
    if (filters.status !== 'all') where.status = productStatusMap[filters.status]
    if (filters.inStock === 'true') where.stock = { gt: 0 }
    if (filters.inStock === 'false') where.stock = 0

    return where
}

export function describeProductFilters(filters: ProductFilters) {
    const descriptions: string[] = []

    if (filters.search !== '') descriptions.push(`Busca: ${filters.search}`)
    if (filters.category !== 'all') {
        descriptions.push(
            `Categoria: ${productCategoryLabels[filters.category] ?? filters.category}`,
        )
    }
    if (filters.status !== 'all') {
        descriptions.push(`Status: ${productStatusLabels[productStatusMap[filters.status]]}`)
    }
    if (filters.inStock !== 'all') {
        descriptions.push(
            `Estoque: ${filters.inStock === 'true' ? 'Com estoque' : 'Sem estoque'}`,
        )
    }

    return descriptions.length > 0 ? descriptions.join(' | ') : 'Todos os produtos'
}
