import { createWriteStream, mkdirSync } from 'node:fs'

import { createProductReport, writeProductReport } from './create-product-report.js'
import type { ProductReportRow } from './table-row.js'

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

const outputDirectory = 'tmp'
const outputPath = `${outputDirectory}/products-report.pdf`

mkdirSync(outputDirectory, { recursive: true })

const stream = createWriteStream(outputPath)
const document = createProductReport()

document.pipe(stream)
writeProductReport(document, createSampleProductRows())
document.end()

await new Promise<void>((resolve, reject) => {
    stream.once('finish', resolve)
    stream.once('error', reject)
    document.once('error', reject)
})

console.log(`Report generated at ${outputPath}`)
