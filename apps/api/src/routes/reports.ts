import { Router } from 'express'

import {
    createProductReport,
    writeProductReport,
} from '../reports/products/create-product-report.js'
import type { ProductReportRow } from '../reports/products/table-row.js'

export const reportsRouter = Router()

function createSampleProductRows(): ProductReportRow[] {
    const categories = ['Monitores', 'Notebooks', 'Teclados', 'Acessórios']
    const statuses = ['Ativo', 'Inativo', 'Sem estoque']

    return Array.from({ length: 100 }, (_, index) => ({
        sku: `SKU-${String(index + 1).padStart(6, '0')}`,
        name:
            index % 10 === 0
                ? `Produto de teste com nome propositalmente longo ${index + 1}`
                : `Produto de teste ${index + 1}`,
        category: categories[index % categories.length],
        price: (179_990 + index * 1_000).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }),
        stock: String((index * 7) % 101),
        status: statuses[index % statuses.length],
    }))
}

reportsRouter.get('/products', (_request, response) => {
    response.setHeader('Content-Type', 'application/pdf')
    response.setHeader(
        'Content-Disposition',
        'inline; filename="products-report.pdf"',
    )

    const document = createProductReport()

    document.pipe(response)
    writeProductReport(document, createSampleProductRows())
    document.end()
})
