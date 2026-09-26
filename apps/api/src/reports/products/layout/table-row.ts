import {
    COLORS,
    FONT_SIZE_NORMAL,
    PRODUCT_TABLE_COLUMNS,
    TABLE_ROW_HEIGHT,
} from './styles.js'

export type ProductReportRow = {
    sku: string
    name: string
    category: string
    price: string
    stock: string
    status: string
}

function fitText(document: PDFKit.PDFDocument, value: string, width: number) {
    if (document.widthOfString(value) <= width) {
        return value
    }

    let truncated = value

    while (
        truncated.length > 0 &&
        document.widthOfString(`${truncated}...`) > width
    ) {
        truncated = truncated.slice(0, -1)
    }

    return `${truncated}...`
}

export function drawProductTableRow(
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
        .moveTo(PRODUCT_TABLE_COLUMNS.sku.x, y + TABLE_ROW_HEIGHT)
        .lineTo(
            PRODUCT_TABLE_COLUMNS.status.x + PRODUCT_TABLE_COLUMNS.status.width,
            y + TABLE_ROW_HEIGHT,
        )
        .lineWidth(0.35)
        .strokeColor(COLORS.line)
        .stroke()

    return y + TABLE_ROW_HEIGHT
}
