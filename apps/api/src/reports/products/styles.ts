export const PAGE_MARGIN = 40
export const PAGE_WIDTH = 595.28
export const PAGE_HEIGHT = 841.89
export const CONTENT_WIDTH = PAGE_WIDTH - PAGE_MARGIN * 2

export const HEADER_HEIGHT = 86
export const COMPACT_HEADER_HEIGHT = 42
export const FOOTER_HEIGHT = 28
export const TABLE_HEADER_HEIGHT = 24
export const TABLE_ROW_HEIGHT = 22

export const FONT_SIZE_SMALL = 8
export const FONT_SIZE_NORMAL = 9
export const FONT_SIZE_TITLE = 20

export const COLORS = {
    text: '#030504',
    muted: '#566159',
    line: '#DCE3DD',
    fill: '#F3F5F1',
} as const

export const PRODUCT_TABLE_COLUMNS = {
    sku: { x: PAGE_MARGIN, width: 70 },
    name: { x: PAGE_MARGIN + 70, width: 145 },
    category: { x: PAGE_MARGIN + 215, width: 90 },
    price: { x: PAGE_MARGIN + 305, width: 75 },
    stock: { x: PAGE_MARGIN + 380, width: 50 },
    status: { x: PAGE_MARGIN + 435, width: 80 },
} as const

export const TABLE_START_Y = PAGE_MARGIN + HEADER_HEIGHT
export const PAGE_BOTTOM = PAGE_HEIGHT - PAGE_MARGIN - FOOTER_HEIGHT
