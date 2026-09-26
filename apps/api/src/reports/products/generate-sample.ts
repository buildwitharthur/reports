import { createWriteStream, mkdirSync } from 'node:fs'

import { createProductReport } from './create-product-report.js'

const outputDirectory = 'tmp'
const outputPath = `${outputDirectory}/products-report.pdf`

mkdirSync(outputDirectory, { recursive: true })

const stream = createWriteStream(outputPath)
const document = createProductReport()

document.pipe(stream)
document.end()

await new Promise<void>((resolve, reject) => {
    stream.once('finish', resolve)
    stream.once('error', reject)
    document.once('error', reject)
})

console.log(`Report generated at ${outputPath}`)
