import { Router } from 'express'
import PDFDocument from 'pdfkit'

import {
    buildProductWhere,
    productCategoryLabels,
    productFiltersSchema,
    productStatusLabels,
} from '../lib/product-filters.js'
import { PAGE_MARGIN } from '../constants/report-products-pdf.js'

import {
    drawFooter,
    drawHeaderReport,
    drawProductReportRows,
} from '../functions/product-report.js'
import { getProductsCursor } from '../functions/get-products-cursor.js'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
})

export const productReportsRouter = Router()

productReportsRouter.get('/products/pdf', async (request, response) => {
    const result = productFiltersSchema.safeParse(request.query)

    if (!result.success) {
        return response.status(400).json({
            error: 'Invalid query parameters',
        })
    }

    const where = buildProductWhere(result.data)

    response.setHeader('Content-Type', 'application/pdf')

    response.setHeader(
        'Content-Disposition',
        'inline; filename="products-report.pdf"',
    )

    const pdf = new PDFDocument({
        size: 'A4',
        margins: {
            top: PAGE_MARGIN,
            right: PAGE_MARGIN,
            bottom: PAGE_MARGIN,
            left: PAGE_MARGIN,
        },
        info: {
            Title: 'Relatório de Produtos',
        },
    })

    pdf.pipe(response)

    let currentCursorId: number | undefined

    // Desenha a estrutura de header base

    let currentReportState = drawHeaderReport(pdf)

    while (true) {
        const { products, hasNextPage, nextCursorId } = await getProductsCursor(
            500,
            currentCursorId,
            where,
        )

        // Não tem produto nenhum para aqui
        if (products.length === 0) break

        // Formata os dados para o formato da tabela
        const rows = products.map((product) => {
            return {
                sku: product.sku,
                name: product.name,
                category:
                    productCategoryLabels[product.category] ?? product.category,
                price: currencyFormatter.format(product.priceInCents / 100),
                stock: String(product.stock),
                status: productStatusLabels[product.status],
            }
        })

        // Desenha as linhas das tabela e atualiza o estado de onde parou

        currentReportState = drawProductReportRows(
            pdf,
            rows,
            currentReportState,
        )

        // Tem outro lote de processamento? Se não para
        if (!hasNextPage) break

        // Atualiza a ref do ultimo item para continuar o processamento no while
        currentCursorId = nextCursorId
    }

    drawFooter(pdf, currentReportState.pageNumber)

    pdf.end()
})
