import { Router } from 'express'

import { productFiltersSchema } from '../lib/product-filters.js'
import { createProductReport } from '../reports/products/create-product-report.js'
import { generateProductReport } from '../reports/products/generate-product-report.js'
import { getProductReportSummary } from '../reports/products/get-product-report-summary.js'

export const productReportsRouter = Router()

productReportsRouter.get('/products/pdf', async (request, response, next) => {
    const result = productFiltersSchema.safeParse(request.query)

    if (!result.success) {
        return response.status(400).json({
            error: 'Invalid query parameters',
        })
    }

    try {
        const filters = result.data
        const summary = await getProductReportSummary(filters)

        response.setHeader('Content-Type', 'application/pdf')
        response.setHeader(
            'Content-Disposition',
            'inline; filename="products-report.pdf"',
        )

        const document = createProductReport()
        document.pipe(response)

        await generateProductReport({
            document,
            filters,
            summary,
        })

        document.end()
    } catch (error) {
        if (response.headersSent) {
            response.destroy()
            return
        }

        next(error)
    }
})
