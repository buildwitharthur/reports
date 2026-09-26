import { Prisma } from '../../generated/prisma/client.js'
import { prisma } from '../../lib/prisma.js'
import {
    productStatusMap,
    type ProductFilters,
} from '../../lib/product-filters.js'
import type { ProductReportSummary } from './layout/summary.js'

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
