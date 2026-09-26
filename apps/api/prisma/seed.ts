import 'dotenv/config'

import { ProductStatus } from '../src/generated/prisma/enums.ts'
import { prisma } from '../src/lib/prisma.ts'

const TOTAL_PRODUCTS = 50_000
const BATCH_SIZE = 1_000
const RANDOM_SEED = 2026

const START_DATE = Date.parse('2025-01-01T00:00:00.000Z')
const END_DATE = Date.parse('2026-09-20T23:59:59.999Z')

const categories = [
    {
        name: 'notebooks',
        families: ['Atlas', 'Vega Air', 'Vega Pro', 'Nova Book'],
        minPrice: 299_990,
        maxPrice: 899_990,
    },
    {
        name: 'monitores',
        families: ['Frame', 'Horizon', 'Vision', 'Pixel'],
        minPrice: 79_90,
        maxPrice: 899_90,
    },
    {
        name: 'teclados',
        families: ['Core', 'Tactile', 'Quantum', 'Pulse'],
        minPrice: 79_90,
        maxPrice: 129_990,
    },
    {
        name: 'mouses',
        families: ['Glide', 'Pulse', 'Orbit', 'Vector'],
        minPrice: 29_90,
        maxPrice: 59_990,
    },
    {
        name: 'headsets',
        families: ['Wave', 'Studio', 'Echo', 'Aural'],
        minPrice: 49_90,
        maxPrice: 99_990,
    },
    {
        name: 'armazenamento',
        families: ['NV Pro', 'Pocket SSD', 'Vault HDD', 'Store'],
        minPrice: 39_90,
        maxPrice: 599_990,
    },
    {
        name: 'memoria',
        families: ['Memory Core', 'Vector RAM', 'Pulse RAM', 'Titan'],
        minPrice: 79_90,
        maxPrice: 399_990,
    },
    {
        name: 'placas-de-video',
        families: ['Apex', 'Vertex', 'Nebula', 'Forge'],
        minPrice: 899_90,
        maxPrice: 1_299_990,
    },
    {
        name: 'acessorios',
        families: ['Link', 'Dock', 'Flex', 'Guard'],
        minPrice: 9_90,
        maxPrice: 19_990,
    },
] as const

const variants = ['Air', 'Core', 'Pro', 'Max', 'Plus', 'Elite'] as const

function createRandomGenerator(seed: number) {
    let state = seed

    return () => {
        state += 0x6d2b79f5
        let value = state
        value = Math.imul(value ^ (value >>> 15), value | 1)
        value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
        return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296
    }
}

function createProduct(index: number, random: () => number) {
    const category = categories[(index - 1) % categories.length]
    const family =
        category.families[Math.floor(random() * category.families.length)]
    const variant = variants[(index - 1) % variants.length]
    const priceRange = category.maxPrice - category.minPrice + 1
    const priceInCents = category.minPrice + Math.floor(random() * priceRange)
    const isOutOfStock = random() < 0.1
    const stock = isOutOfStock ? 0 : 1 + Math.floor(random() * 100)
    const status = isOutOfStock
        ? ProductStatus.OUT_OF_STOCK
        : random() < 0.055
          ? ProductStatus.INACTIVE
          : ProductStatus.ACTIVE
    const dateProgress = (index - 1) / (TOTAL_PRODUCTS - 1)
    const createdAt = new Date(
        START_DATE + Math.floor((END_DATE - START_DATE) * dateProgress),
    )

    return {
        sku: `SKU-${String(index).padStart(6, '0')}`,
        name: `${family} ${variant} ${String(index).padStart(5, '0')}`,
        category: category.name,
        priceInCents,
        stock,
        status,
        createdAt,
    }
}

async function main() {
    console.log('Seeding database...')

    await prisma.product.deleteMany()
    console.log('Deleted existing products.')

    const random = createRandomGenerator(RANDOM_SEED)
    let inserted = 0

    for (let start = 1; start <= TOTAL_PRODUCTS; start += BATCH_SIZE) {
        const end = Math.min(start + BATCH_SIZE - 1, TOTAL_PRODUCTS)
        const products = []

        for (let index = start; index <= end; index += 1) {
            products.push(createProduct(index, random))
        }

        await prisma.product.createMany({
            data: products,
        })

        inserted += products.length
        console.log(
            `Inserted ${inserted.toLocaleString('en-US')} / ${TOTAL_PRODUCTS.toLocaleString('en-US')} products`,
        )
    }

    const total = await prisma.product.count()
    console.log(`Seed completed with ${total} products.`)
}

main()
    .catch((error) => {
        console.error(error)
        process.exitCode = 1
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
