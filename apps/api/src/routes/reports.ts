import { Router } from 'express'

import { prisma } from '../lib/prisma.js'
import {
    createProductReport,
    finishProductReport,
    toProductReportRow,
    writeProductReportRows,
    writeProductReportStart,
} from '../reports/products/create-product-report.js'

const BATCH_SIZE = 500

export const reportsRouter = Router()

reportsRouter.get('/products', async (request, response, next) => {
    response.setHeader('Content-Type', 'application/pdf')
    response.setHeader(
        'Content-Disposition',
        'inline; filename="products-report.pdf"',
    )

    const document = createProductReport()
    document.pipe(response)

    try {
        const generatedAt = new Date()
        let state = writeProductReportStart(document, generatedAt)
        let cursorId: number | undefined
        let processed = 0

        console.log('Report started')

        while (!request.aborted && !response.destroyed) {
            const products = await prisma.product.findMany({
                take: BATCH_SIZE,
                ...(cursorId !== undefined
                    ? {
                          cursor: {
                              id: cursorId,
                          },
                          skip: 1,
                      }
                    : {}),
                orderBy: {
                    id: 'asc',
                },
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

            if (products.length === 0) {
                break
            }

            const rows = products.map(toProductReportRow)
            state = writeProductReportRows(document, rows, state)
            processed += products.length
            cursorId = products[products.length - 1].id

            console.log(`Processed ${processed} products`)

            if (products.length < BATCH_SIZE) {
                break
            }
        }

        if (request.aborted || response.destroyed) {
            document.destroy()
            return
        }

        finishProductReport(document, state)
        document.end()
        console.log('Report completed')
    } catch (error) {
        if (!response.headersSent) {
            next(error)
            return
        }

        console.error(error)
        document.destroy()
        response.destroy()
    }
})
