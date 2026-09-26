import {
    COLORS,
    FONT_SIZE_SMALL,
    FOOTER_HEIGHT,
    PAGE_HEIGHT,
    PAGE_MARGIN,
    PAGE_WIDTH,
} from './styles.js'

export function drawProductReportFooter(
    document: PDFKit.PDFDocument,
    pageNumber: number,
) {
    const y = PAGE_HEIGHT - PAGE_MARGIN - FOOTER_HEIGHT

    document
        .moveTo(PAGE_MARGIN, y)
        .lineTo(PAGE_WIDTH - PAGE_MARGIN, y)
        .lineWidth(0.5)
        .strokeColor(COLORS.line)
        .stroke()

    document
        .fillColor(COLORS.muted)
        .fontSize(FONT_SIZE_SMALL)
        .text('ReportForge', PAGE_MARGIN, y + 9, {
            width: 120,
            height: FONT_SIZE_SMALL,
            lineBreak: false,
        })
        .text(`Página ${pageNumber}`, PAGE_WIDTH - PAGE_MARGIN - 80, y + 9, {
            width: 80,
            height: FONT_SIZE_SMALL,
            align: 'right',
            lineBreak: false,
        })
}
