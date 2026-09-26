import { Router } from 'express'
import { z } from 'zod'

import type { Prisma } from '../generated/prisma/client.js'
import { buildProductWhere, productFiltersSchema } from '../lib/product-filters.js'
import { prisma } from '../lib/prisma.js'

const productsQuerySchema = productFiltersSchema.extend({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(50),
    sort: z
        .enum(['name', 'price', 'stock', 'recent', 'category'])
        .default('name'),
    order: z.enum(['asc', 'desc']).default('asc'),
})

export const productsRouter = Router()

productsRouter.get('/', async (request, response) => {
    const result = productsQuerySchema.safeParse(request.query)

    if (!result.success) {
        return response.status(400).json({
            error: 'Invalid query parameters',
        })
    }

    const { page, limit, search, category, status, inStock, sort, order } =
        result.data
    const skip = (page - 1) * limit

    const filters = { search, category, status, inStock }
    const where = buildProductWhere(filters)

    const orderBy: Prisma.ProductOrderByWithRelationInput[] = []

    switch (sort) {
        case 'name':
            orderBy.push({ name: order }, { id: 'asc' })
            break
        case 'price':
            orderBy.push({ priceInCents: order }, { id: 'asc' })
            break
        case 'stock':
            orderBy.push({ stock: order }, { id: 'asc' })
            break
        case 'recent':
            orderBy.push({ createdAt: order }, { id: 'asc' })
            break
        case 'category':
            orderBy.push({ category: order }, { name: order }, { id: 'asc' })
            break
    }

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            orderBy,
            skip,
            take: limit,
        }),
        prisma.product.count({
            where,
        }),
    ])

    return response.json({
        data: products,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    })
})
