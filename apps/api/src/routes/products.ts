import { Router } from 'express'
import { z } from 'zod'

import { prisma } from '../lib/prisma.js'

const productsQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(50),
})

export const productsRouter = Router()

productsRouter.get('/', async (request, response) => {
    const result = productsQuerySchema.safeParse(request.query)

    if (!result.success) {
        return response.status(400).json({
            error: 'Invalid query parameters',
        })
    }

    const { page, limit } = result.data
    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            skip,
            take: limit,
            orderBy: {
                id: 'asc',
            },
        }),
        prisma.product.count(),
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
