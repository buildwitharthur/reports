import PDFDocument from 'pdfkit'

export function createPdfDocument() {
    return new PDFDocument({
        size: 'A4',
        margin: 40,
        info: {
            Title: 'Relatórios',
            Author: 'ArthurLabs',
        },
    })
}
