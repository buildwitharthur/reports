import {
    COLORS,
    CONTENT_WIDTH,
    FONT_SIZE_NORMAL,
    FONT_SIZE_SMALL,
    FONT_SIZE_TITLE,
    FOOTER_HEIGHT,
    PAGE_BOTTOM,
    PAGE_HEIGHT,
    PAGE_MARGIN,
    PAGE_WIDTH,
    PRODUCT_TABLE_COLUMNS,
    TABLE_HEADER_HEIGHT,
    TABLE_ROW_HEIGHT,
} from '../constants/report-products-pdf.js'

import {
    productCategoryLabels,
    productStatusLabels,
} from '../lib/product-filters.js'

export type ProductReportRow = {
    sku: string
    name: string
    category: string
    price: string
    stock: string
    status: string
}

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
}

function drawTableHeader(document: PDFKit.PDFDocument, y: number) {
    document
        .rect(PAGE_MARGIN, y, CONTENT_WIDTH, TABLE_HEADER_HEIGHT)
        .fill(COLORS.fill)

    const headers = [
        { label: 'SKU', ...PRODUCT_TABLE_COLUMNS.sku, align: 'left' as const },
        {
            label: 'Produto',
            ...PRODUCT_TABLE_COLUMNS.name,
            align: 'left' as const,
        },
        {
            label: 'Categoria',
            ...PRODUCT_TABLE_COLUMNS.category,
            align: 'left' as const,
        },
        {
            label: 'Preço',
            ...PRODUCT_TABLE_COLUMNS.price,
            align: 'right' as const,
        },
        {
            label: 'Estoque',
            ...PRODUCT_TABLE_COLUMNS.stock,
            align: 'right' as const,
        },
        {
            label: 'Status',
            ...PRODUCT_TABLE_COLUMNS.status,
            align: 'left' as const,
        },
    ]

    document.fillColor(COLORS.text).fontSize(FONT_SIZE_SMALL)

    for (const header of headers) {
        document.text(header.label, header.x, y + 7, {
            width: header.width,
            height: TABLE_HEADER_HEIGHT,
            align: header.align,
            lineBreak: false,
        })
    }

    document
        .moveTo(PAGE_MARGIN, y + TABLE_HEADER_HEIGHT)
        .lineTo(PAGE_MARGIN + CONTENT_WIDTH, y + TABLE_HEADER_HEIGHT)
        .lineWidth(0.5)
        .strokeColor(COLORS.line)
        .stroke()

    return y + TABLE_HEADER_HEIGHT
}

function fitText(document: PDFKit.PDFDocument, value: string, width: number) {
    if (document.widthOfString(value) <= width) return value

    let truncated = value
    while (
        truncated.length > 0 &&
        document.widthOfString(`${truncated}...`) > width
    ) {
        truncated = truncated.slice(0, -1)
    }

    return `${truncated}...`
}

function drawTableRow(
    document: PDFKit.PDFDocument,
    product: ProductReportRow,
    y: number,
) {
    const cells = [
        {
            value: product.sku,
            ...PRODUCT_TABLE_COLUMNS.sku,
            align: 'left' as const,
        },
        {
            value: product.name,
            ...PRODUCT_TABLE_COLUMNS.name,
            align: 'left' as const,
        },
        {
            value: product.category,
            ...PRODUCT_TABLE_COLUMNS.category,
            align: 'left' as const,
        },
        {
            value: product.price,
            ...PRODUCT_TABLE_COLUMNS.price,
            align: 'right' as const,
        },
        {
            value: product.stock,
            ...PRODUCT_TABLE_COLUMNS.stock,
            align: 'right' as const,
        },
        {
            value: product.status,
            ...PRODUCT_TABLE_COLUMNS.status,
            align: 'left' as const,
        },
    ]

    document.fillColor(COLORS.text).fontSize(FONT_SIZE_NORMAL)

    for (const cell of cells) {
        document.text(
            fitText(document, cell.value, cell.width),
            cell.x,
            y + 6,
            {
                width: cell.width,
                height: TABLE_ROW_HEIGHT,
                align: cell.align,
                ellipsis: true,
                lineBreak: false,
            },
        )
    }

    document
        .moveTo(PAGE_MARGIN, y + TABLE_ROW_HEIGHT)
        .lineTo(PAGE_MARGIN + CONTENT_WIDTH, y + TABLE_ROW_HEIGHT)
        .lineWidth(0.35)
        .strokeColor(COLORS.line)
        .stroke()

    return y + TABLE_ROW_HEIGHT
}

export function drawFooter(document: PDFKit.PDFDocument, pageNumber: number) {
    const y = PAGE_HEIGHT - PAGE_MARGIN - FOOTER_HEIGHT

    document
        .fillColor(COLORS.muted)
        .fontSize(FONT_SIZE_SMALL)
        .text(`Página ${pageNumber}`, PAGE_WIDTH - PAGE_MARGIN - 80, y + 9, {
            width: 80,
            height: FONT_SIZE_SMALL,
            align: 'right',
            lineBreak: false,
        })
}

export function drawHeaderReport(
    document: PDFKit.PDFDocument,
): ProductReportState {
    const currentY =
        document
            .fillColor(COLORS.text)
            .fontSize(FONT_SIZE_TITLE)
            .text('Relatório de Produtos', PAGE_MARGIN, PAGE_MARGIN).y + 12

    return {
        currentY: drawTableHeader(document, currentY),
        pageNumber: 1,
    }
}

export function drawProductReportRows(
    document: PDFKit.PDFDocument,
    rows: ProductReportRow[],
    state: ProductReportState,
): ProductReportState {
    let currentY = state.currentY
    let pageNumber = state.pageNumber

    for (const product of rows) {
        if (currentY + TABLE_ROW_HEIGHT > PAGE_BOTTOM) {
            drawFooter(document, pageNumber)
            document.addPage()
            pageNumber += 1
            currentY = drawTableHeader(document, PAGE_MARGIN)
        }

        currentY = drawTableRow(document, product, currentY)
    }

    return { currentY, pageNumber }
}
