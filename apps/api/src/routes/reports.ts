import { Router } from 'express'

import { createProductReport } from '../reports/products/create-product-report.js'

export const reportsRouter = Router()

reportsRouter.get('/products', (_request, response) => {
    response.setHeader('Content-Type', 'application/pdf')
    response.setHeader(
        'Content-Disposition',
        'inline; filename="products-report.pdf"',
    )

    const document = createProductReport()

    document.pipe(response)
    document.end()
})
