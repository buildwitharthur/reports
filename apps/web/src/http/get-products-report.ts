import { api } from '../lib/axios'
import type { ProductFilters } from '../types'

export async function getProductsReport(
    filters: ProductFilters,
): Promise<Blob> {
    const response = await api.get<Blob>('/reports/products/pdf', {
        params: filters,
        responseType: 'blob',
    })

    return response.data
}
