import { Router } from 'express'

import { buildProductWhere, productFiltersSchema } from '../lib/product-filters.js'
import { prisma } from '../lib/prisma.js'
import {
    createProductReport,
    finishProductReport,
    toProductReportRow,
    writeProductReportEmptyState,
    writeProductReportRows,
    writeProductReportStart,
} from '../reports/products/create-product-report.js'
import { getProductReportSummary } from '../reports/products/summary.js'

const BATCH_SIZE = 500

export const reportsRouter = Router()

reportsRouter.get('/products', async (request, response, next) => {
    const result = productFiltersSchema.safeParse(request.query)

    if (!result.success) {
        return response.status(400).json({
            error: 'Invalid query parameters',
        })
    }

    const filters = result.data
    const where = buildProductWhere(filters)

    try {
        const summary = await getProductReportSummary(filters)

        if (request.aborted || response.destroyed) return

        response.setHeader('Content-Type', 'application/pdf')
        response.setHeader(
            'Content-Disposition',
            'inline; filename="products-report.pdf"',
        )

        const document = createProductReport()
        document.pipe(response)

        try {
            const generatedAt = new Date()
            let state = writeProductReportStart(
                document,
                generatedAt,
                filters,
                summary,
            )
            let cursorId: number | undefined
            let processed = 0

            console.log('Report started')

            if (summary.total === 0) {
                writeProductReportEmptyState(document, state)
            } else {
                while (!request.aborted && !response.destroyed) {
                    const products = await prisma.product.findMany({
                        where,
                        take: BATCH_SIZE,
                        ...(cursorId !== undefined
                            ? {
                                  cursor: { id: cursorId },
                                  skip: 1,
                              }
                            : {}),
                        orderBy: { id: 'asc' },
                        select: {
                            id: true,
                            sku: true,
                            name: true,
                            category: true,
                            priceInCents: true,
                            stock: true,
                            status: true,
                        },
                    })

                    if (products.length === 0) break

                    for (const product of products) {
                        state = writeProductReportRows(
                            document,
                            [toProductReportRow(product)],
                            state,
                        )
                    }

                    processed += products.length
                    cursorId = products[products.length - 1].id
                    console.log(`Processed ${processed} products`)

                    if (products.length < BATCH_SIZE) break
                }
            }

            if (request.aborted || response.destroyed) {
                document.destroy()
                return
            }

            finishProductReport(document, state)
            document.end()
            console.log(`Report completed: ${processed} products`)
        } catch (error) {
            if (!response.headersSent) {
                document.destroy()
                next(error)
                return
            }

            console.error(error)
            document.destroy()
            response.destroy()
        }
    } catch (error) {
        next(error)
    }
})
