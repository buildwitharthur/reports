import { createPdfDocument } from '../../lib/pdf.js'
import { drawProductReportFooter } from './footer.js'
import { drawProductReportHeader } from './header.js'
import { drawProductTableHeader } from './table-header.js'
import { drawProductTableRow, type ProductReportRow } from './table-row.js'
import { PAGE_BOTTOM, TABLE_START_Y } from './styles.js'

export function createProductReport() {
    return createPdfDocument()
}

export function writeProductReport(
    document: PDFKit.PDFDocument,
    rows: ProductReportRow[],
) {
    const generatedAt = new Date()
    let pageNumber = 1
    let currentY = drawProductReportHeader(document, generatedAt, true)

    currentY = drawProductTableHeader(document, currentY || TABLE_START_Y)

    for (const product of rows) {
        if (currentY + 22 > PAGE_BOTTOM) {
            drawProductReportFooter(document, pageNumber)
            document.addPage()
            pageNumber += 1
            currentY = drawProductReportHeader(document, generatedAt, false)
            currentY = drawProductTableHeader(document, currentY)
        }

        currentY = drawProductTableRow(document, product, currentY)
    }

    drawProductReportFooter(document, pageNumber)
}
