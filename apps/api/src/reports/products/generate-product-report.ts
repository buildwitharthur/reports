import {
    buildProductWhere,
    type ProductFilters,
} from '../../lib/product-filters.js'
import { prisma } from '../../lib/prisma.js'
import {
    finishProductReport,
    toProductReportRow,
    writeProductReportEmptyState,
    writeProductReportRows,
    writeProductReportStart,
} from './create-product-report.js'
import type { ProductReportSummary } from './summary.js'

const BATCH_SIZE = 500

type GenerateProductReportParams = {
    document: PDFKit.PDFDocument
    filters: ProductFilters
    summary: ProductReportSummary
    isCancelled: () => boolean
}

export async function generateProductReport({
    document,
    filters,
    summary,
    isCancelled,
}: GenerateProductReportParams) {
    const where = buildProductWhere(filters)
    const generatedAt = new Date()
    let state = writeProductReportStart(document, generatedAt, filters, summary)

    if (summary.total === 0) {
        writeProductReportEmptyState(document, state)
        finishProductReport(document, state)
        return
    }

    let cursorId: number | undefined

    while (!isCancelled()) {
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

        const rows = products.map(toProductReportRow)
        state = writeProductReportRows(document, rows, state)
        cursorId = products.at(-1)!.id

        if (products.length < BATCH_SIZE) break
    }

    if (!isCancelled()) {
        finishProductReport(document, state)
    }
}
