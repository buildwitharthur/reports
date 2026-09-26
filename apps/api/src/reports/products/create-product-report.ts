import { createPdfDocument } from '../../lib/pdf.js'
import { drawProductReportFooter } from './footer.js'
import { drawProductReportHeader } from './header.js'
import { drawProductTableHeader } from './table-header.js'
import { drawProductTableRow, type ProductReportRow } from './table-row.js'
import { PAGE_BOTTOM, TABLE_ROW_HEIGHT } from './styles.js'

type ProductForReport = {
    sku: string
    name: string
    category: string
    priceInCents: number
    stock: number
    status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK'
}

export type ProductReportState = {
    currentY: number
    pageNumber: number
    generatedAt: Date
}

const categoryLabels: Record<string, string> = {
    notebooks: 'Notebooks',
    monitores: 'Monitores',
    teclados: 'Teclados',
    mouses: 'Mouses',
    headsets: 'Headsets',
    armazenamento: 'Armazenamento',
    memoria: 'Memória',
    'placas-de-video': 'Placas de vídeo',
    acessorios: 'Acessórios',
}

const statusLabels: Record<ProductForReport['status'], string> = {
    ACTIVE: 'Ativo',
    INACTIVE: 'Inativo',
    OUT_OF_STOCK: 'Sem estoque',
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
})

export function toProductReportRow(
    product: ProductForReport,
): ProductReportRow {
    return {
        sku: product.sku,
        name: product.name,
        category: categoryLabels[product.category] ?? product.category,
        price: currencyFormatter.format(product.priceInCents / 100),
        stock: String(product.stock),
        status: statusLabels[product.status],
    }
}

export function createProductReport() {
    return createPdfDocument()
}

export function writeProductReportStart(
    document: PDFKit.PDFDocument,
    generatedAt: Date,
): ProductReportState {
    const pageNumber = 1
    let currentY = drawProductReportHeader(document, generatedAt, true)
    currentY = drawProductTableHeader(document, currentY)

    return {
        currentY,
        pageNumber,
        generatedAt,
    }
}

export function writeProductReportRows(
    document: PDFKit.PDFDocument,
    rows: ProductReportRow[],
    state: ProductReportState,
): ProductReportState {
    let currentY = state.currentY
    let pageNumber = state.pageNumber

    for (const product of rows) {
        if (currentY + TABLE_ROW_HEIGHT > PAGE_BOTTOM) {
            drawProductReportFooter(document, pageNumber)
            document.addPage()
            pageNumber += 1
            currentY = drawProductReportHeader(document, state.generatedAt, false)
            currentY = drawProductTableHeader(document, currentY)
        }

        currentY = drawProductTableRow(document, product, currentY)
    }

    return {
        currentY,
        pageNumber,
        generatedAt: state.generatedAt,
    }
}

export function finishProductReport(
    document: PDFKit.PDFDocument,
    state: ProductReportState,
) {
    drawProductReportFooter(document, state.pageNumber)
}
