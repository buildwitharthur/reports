import { api } from '../lib/axios'

export async function getProducts(
    params: GetProductsParams,
): Promise<GetProductsResponse> {
    const response = await api.get<GetProductsResponse>('/catalog/products', {
        params,
    })

    return response.data
}
