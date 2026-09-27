import { parseAsInteger, parseAsString, parseAsStringLiteral } from 'nuqs'

const categoryValues = [
    'all',
    'notebooks',
    'monitores',
    'teclados',
    'mouses',
    'headsets',
    'armazenamento',
    'memoria',
    'placas-de-video',
    'acessorios',
] as const

const statusValues = ['all', 'active', 'inactive', 'out_of_stock'] as const
const inStockValues = ['all', 'true', 'false'] as const
const sortValues = ['name', 'price', 'stock', 'recent', 'category'] as const
const orderValues = ['asc', 'desc'] as const

export const productQueryParams = {
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(7),
    search: parseAsString.withDefault(''),
    category: parseAsStringLiteral(categoryValues).withDefault('all'),
    status: parseAsStringLiteral(statusValues).withDefault('all'),
    inStock: parseAsStringLiteral(inStockValues).withDefault('all'),
    sort: parseAsStringLiteral(sortValues).withDefault('name'),
    order: parseAsStringLiteral(orderValues).withDefault('asc'),
}
