import { Prisma } from '../../generated/prisma/client.js'
import { prisma } from '../../lib/prisma.js'
import {
    productStatusMap,
    type ProductFilters,
} from '../../lib/product-filters.js'
import {
    COLORS,
    CONTENT_WIDTH,
    FONT_SIZE_NORMAL,
    FONT_SIZE_SMALL,
    PAGE_MARGIN,
} from './styles.js'

export type ProductReportSummary = {
    total: number
    inStock: number
    outOfStock: number
    stockValueInCents: number
}

type ProductReportSummaryRow = {
    total: bigint | number
    inStock: bigint | number
    outOfStock: bigint | number
    stockValueInCents: bigint | number
}

function buildSummarySqlWhere(filters: ProductFilters) {
    const conditions: Prisma.Sql[] = []

    if (filters.search !== '') {
        const pattern = `%${filters.search}%`
        conditions.push(
            Prisma.sql`("name" ILIKE ${pattern} OR "sku" ILIKE ${pattern})`,
        )
    }

    if (filters.category !== 'all') {
        conditions.push(Prisma.sql`"category" = ${filters.category}`)
    }

    if (filters.status !== 'all') {
        const status = productStatusMap[filters.status]
        conditions.push(
            Prisma.sql`"status" = CAST(${status} AS "ProductStatus")`,
        )
    }

    if (filters.inStock === 'true') {
        conditions.push(Prisma.sql`"stock" > 0`)
    }

    if (filters.inStock === 'false') {
        conditions.push(Prisma.sql`"stock" = 0`)
    }

    if (conditions.length === 0) return Prisma.empty

    return Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`
}

export async function getProductReportSummary(
    filters: ProductFilters,
): Promise<ProductReportSummary> {
    const where = buildSummarySqlWhere(filters)
    const [row] = await prisma.$queryRaw<ProductReportSummaryRow[]>(Prisma.sql`
        SELECT
            COUNT(*)::bigint AS "total",
            COUNT(*) FILTER (WHERE "stock" > 0)::bigint AS "inStock",
            COUNT(*) FILTER (WHERE "stock" = 0)::bigint AS "outOfStock",
            COALESCE(
                SUM("priceInCents"::bigint * "stock"::bigint),
                0
            )::bigint AS "stockValueInCents"
        FROM "Product"
        ${where}
    `)

    return {
        total: Number(row?.total ?? 0),
        inStock: Number(row?.inStock ?? 0),
        outOfStock: Number(row?.outOfStock ?? 0),
        stockValueInCents: Number(row?.stockValueInCents ?? 0),
    }
}

export function drawProductReportSummary(
    document: PDFKit.PDFDocument,
    summary: ProductReportSummary,
    y: number,
) {
    const columnWidth = CONTENT_WIDTH / 4
    const boxY = y + 18
    const numberFormatter = new Intl.NumberFormat('pt-BR')
    const currencyFormatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    })
    const values = [
        ['Total de produtos', numberFormatter.format(summary.total)],
        ['Em estoque', numberFormatter.format(summary.inStock)],
        ['Sem estoque', numberFormatter.format(summary.outOfStock)],
        [
            'Valor em estoque',
            currencyFormatter.format(summary.stockValueInCents / 100),
        ],
    ]

    document
        .fillColor(COLORS.muted)
        .fontSize(FONT_SIZE_SMALL)
        .text('RESUMO', PAGE_MARGIN, y)

    for (const [index, [label, value]] of values.entries()) {
        const x = PAGE_MARGIN + index * columnWidth

        document
            .fillColor(COLORS.muted)
            .fontSize(FONT_SIZE_SMALL)
            .text(label, x, boxY, {
                width: columnWidth - 8,
                lineBreak: false,
            })
            .fillColor(COLORS.text)
            .fontSize(FONT_SIZE_NORMAL)
            .text(value, x, boxY + 13, {
                width: columnWidth - 8,
                lineBreak: false,
                align: index === 3 ? 'right' : 'left',
            })
    }

    document
        .moveTo(PAGE_MARGIN, boxY + 35)
        .lineTo(PAGE_MARGIN + CONTENT_WIDTH, boxY + 35)
        .lineWidth(0.5)
        .strokeColor(COLORS.line)
        .stroke()

    return boxY + 45
}

export function drawProductReportEmptyMessage(
    document: PDFKit.PDFDocument,
    y: number,
) {
    document
        .fillColor(COLORS.muted)
        .fontSize(FONT_SIZE_NORMAL)
        .text(
            'Nenhum produto encontrado para os filtros aplicados.',
            PAGE_MARGIN,
            y + 12,
        )
}
