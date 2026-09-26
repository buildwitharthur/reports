import {
    COLORS,
    COMPACT_HEADER_HEIGHT,
    FONT_SIZE_NORMAL,
    FONT_SIZE_SMALL,
    FONT_SIZE_TITLE,
    HEADER_HEIGHT,
    PAGE_MARGIN,
} from './styles.js'

import {
    describeProductFilters,
    type ProductFilters,
} from '../../lib/product-filters.js'

function formatGeneratedAt(generatedAt: Date) {
    const formatted = new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(generatedAt)

    return formatted.replace(', ', ' às ')
}

export function drawProductReportHeader(
    document: PDFKit.PDFDocument,
    generatedAt: Date,
    firstPage: boolean,
    filters?: ProductFilters,
) {
    const title = 'Relatório de Produtos'

    document.fillColor(COLORS.text)

    if (firstPage) {
        document
            .fontSize(FONT_SIZE_NORMAL)
            .text('ReportForge', PAGE_MARGIN, PAGE_MARGIN)
        document
            .fontSize(FONT_SIZE_TITLE)
            .text(title, PAGE_MARGIN, PAGE_MARGIN + 18)
        document
            .fillColor(COLORS.muted)
            .fontSize(FONT_SIZE_SMALL)
            .text(
                `Gerado em: ${formatGeneratedAt(generatedAt)}`,
                PAGE_MARGIN,
                PAGE_MARGIN + 52,
            )

        if (filters) {
            document.text(
                `Filtros: ${describeProductFilters(filters)}`,
                PAGE_MARGIN,
                PAGE_MARGIN + 68,
                { width: 515, lineBreak: false },
            )
        }

        return PAGE_MARGIN + HEADER_HEIGHT
    }

    document
        .fontSize(FONT_SIZE_NORMAL)
        .text('ReportForge', PAGE_MARGIN, PAGE_MARGIN)
    document
        .fillColor(COLORS.muted)
        .fontSize(FONT_SIZE_SMALL)
        .text(title, PAGE_MARGIN, PAGE_MARGIN + 18)

    return PAGE_MARGIN + COMPACT_HEADER_HEIGHT
}
