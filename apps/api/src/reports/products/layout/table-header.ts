import {
    COLORS,
    CONTENT_WIDTH,
    FONT_SIZE_SMALL,
    PRODUCT_TABLE_COLUMNS,
    TABLE_HEADER_HEIGHT,
} from './styles.js'

export function drawProductTableHeader(
    document: PDFKit.PDFDocument,
    y: number,
) {
    document
        .rect(
            PRODUCT_TABLE_COLUMNS.sku.x,
            y,
            CONTENT_WIDTH,
            TABLE_HEADER_HEIGHT,
        )
        .fill(COLORS.fill)

    document.fillColor(COLORS.text).fontSize(FONT_SIZE_SMALL)

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

    for (const header of headers) {
        document.text(header.label, header.x, y + 7, {
            width: header.width,
            height: TABLE_HEADER_HEIGHT,
            align: header.align,
            lineBreak: false,
        })
    }

    document
        .moveTo(PRODUCT_TABLE_COLUMNS.sku.x, y + TABLE_HEADER_HEIGHT)
        .lineTo(
            PRODUCT_TABLE_COLUMNS.status.x + PRODUCT_TABLE_COLUMNS.status.width,
            y + TABLE_HEADER_HEIGHT,
        )
        .lineWidth(0.5)
        .strokeColor(COLORS.line)
        .stroke()

    return y + TABLE_HEADER_HEIGHT
}
