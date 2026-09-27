import { Prisma } from '../generated/prisma/client.js'
import { prisma } from '../lib/prisma.js'

export async function getProductsCursor(
    limit: number,
    currentCursorId?: number,
    where?: Prisma.ProductWhereInput,
) {
    const cursor =
        currentCursorId !== undefined ? { id: currentCursorId } : undefined

    const products = await prisma.product.findMany({
        where,
        take: limit + 1,
        cursor,
        select: {
            id: true,
            sku: true,
            name: true,
            category: true,
            priceInCents: true,
            stock: true,
            status: true,
        },
        orderBy: { id: 'asc' },
    })

    const lastProductId = products.at(-1)?.id

    const hasNextPage = products.length > limit

    // limit = 10
    //    ↓
    // busca 11
    //    ↓
    // vieram 11?
    //    ↓
    // sim
    //    ↓
    // existe próxima página

    return {
        products,
        hasNextPage,
        nextCursorId: hasNextPage ? lastProductId : undefined,
    }
}
