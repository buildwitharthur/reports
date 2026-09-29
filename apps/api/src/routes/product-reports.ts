import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'

import { stringify } from 'csv-stringify'
import { Router } from 'express'

import {
    buildProductWhere,
    productCategoryLabels,
    productFiltersSchema,
    productStatusLabels,
} from '../lib/product-filters.js'
import { getProductsCursor } from '../functions/get-products-cursor.js'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
})

export const productReportsRouter = Router()

productReportsRouter.get('/products/csv', async (request, response) => {
    const result = productFiltersSchema.safeParse(request.query)

    if (!result.success) {
        return response.status(400).json({
            error: 'Invalid query parameters',
        })
    }

    const where = buildProductWhere(result.data)

    response.setHeader('Content-Type', 'text/csv; charset=utf-8')
    response.setHeader(
        'Content-Disposition',
        'attachment; filename="products-report.csv"',
    )

    async function* generateProducts() {
        let currentCursorId: number | undefined

        while (true) {
            const { products, hasNextPage, nextCursorId } =
                await getProductsCursor(5000, currentCursorId, where)

            if (products.length === 0) break

            for (const product of products) {
                yield {
                    sku: product.sku,
                    name: product.name,
                    category:
                        productCategoryLabels[product.category] ??
                        product.category,
                    price: currencyFormatter.format(product.priceInCents / 100),
                    stock: product.stock,
                    status:
                        productStatusLabels[product.status] ?? product.status,
                }
            }

            if (!hasNextPage) break

            currentCursorId = nextCursorId
        }
    }

    const csv = stringify({
        header: true,
        bom: true,
        delimiter: ';',
        columns: [
            { key: 'sku', header: 'SKU' },
            { key: 'name', header: 'Nome' },
            { key: 'category', header: 'Categoria' },
            { key: 'price', header: 'Preço' },
            { key: 'stock', header: 'Estoque' },
            { key: 'status', header: 'Status' },
        ],
    })

    await pipeline(Readable.from(generateProducts()), csv, response)
})
