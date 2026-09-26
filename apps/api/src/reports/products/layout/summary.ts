import {
    COLORS,
    CONTENT_WIDTH,
    FONT_SIZE_NORMAL,
    FONT_SIZE_SMALL,
    PAGE_MARGIN,
} from './styles.js'

export type ProductReportSummary = {
    total: number
    inStock: number
    outOfStock: number
    stockValueInCents: number
}

export function drawProductReportSummary(
    document: PDFKit.PDFDocument,
    summary: ProductReportSummary,
    y: number,
) {
    const columnWidth = CONTENT_WIDTH / 4
    const boxY = y + 18
    const numberFormatter = new Intl.NumberFormat('pt-BR')
    const currencyFormatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    })
    const values = [
        ['Total de produtos', numberFormatter.format(summary.total)],
        ['Em estoque', numberFormatter.format(summary.inStock)],
        ['Sem estoque', numberFormatter.format(summary.outOfStock)],
        [
            'Valor em estoque',
            currencyFormatter.format(summary.stockValueInCents / 100),
        ],
    ]

    document
        .fillColor(COLORS.muted)
        .fontSize(FONT_SIZE_SMALL)
        .text('RESUMO', PAGE_MARGIN, y)

    for (const [index, [label, value]] of values.entries()) {
        const x = PAGE_MARGIN + index * columnWidth

        document
            .fillColor(COLORS.muted)
            .fontSize(FONT_SIZE_SMALL)
            .text(label, x, boxY, {
                width: columnWidth - 8,
                lineBreak: false,
            })
            .fillColor(COLORS.text)
            .fontSize(FONT_SIZE_NORMAL)
            .text(value, x, boxY + 13, {
                width: columnWidth - 8,
                lineBreak: false,
                align: index === 3 ? 'right' : 'left',
            })
    }

    document
        .moveTo(PAGE_MARGIN, boxY + 35)
        .lineTo(PAGE_MARGIN + CONTENT_WIDTH, boxY + 35)
        .lineWidth(0.5)
        .strokeColor(COLORS.line)
        .stroke()

    return boxY + 45
}

export function drawProductReportEmptyMessage(
    document: PDFKit.PDFDocument,
    y: number,
) {
    document
        .fillColor(COLORS.muted)
        .fontSize(FONT_SIZE_NORMAL)
        .text(
            'Nenhum produto encontrado para os filtros aplicados.',
            PAGE_MARGIN,
            y + 12,
        )
}
