import { createPdfDocument } from '../../lib/pdf.js'

export function createProductReport() {
    const document = createPdfDocument()

    document
        .fontSize(10)
        .text('ReportForge')

    document
        .moveDown()
        .fontSize(20)
        .text('Relatório de Produtos')

    document
        .moveDown()
        .fontSize(10)
        .text('PDF gerado com sucesso.')

    return document
}
