

import type { Product } from '../types'

import { Badge } from './ui/badge'


type ProductsTableProps = {
    products: Product[]
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
})

const statusPresentation = {
    ACTIVE: { label: 'Ativo', variant: 'success' },
    INACTIVE: { label: 'Inativo', variant: 'neutral' },
    OUT_OF_STOCK: { label: 'Sem estoque', variant: 'warning' },
} as const

export function ProductsTable({ products }: ProductsTableProps) {
    return (
        <div className="overflow-x-auto rounded-lg border border-line bg-surface">
            <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                    <tr className="border-b border-line text-meta text-text-muted">
                        <th className="px-4 py-3 font-medium">SKU</th>
                        <th className="px-4 py-3 font-medium">Produto</th>
                        <th className="px-4 py-3 font-medium">Categoria</th>
                        <th className="px-4 py-3 text-right font-medium">
                            Preço
                        </th>
                        <th className="px-4 py-3 text-right font-medium">
                            Estoque
                        </th>
                        <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => {
                        const status = statusPresentation[product.status]

                        return (
                            <tr
                                key={product.id}
                                className="border-b border-line last:border-b-0 hover:bg-surface-raised"
                            >
                                <td className="px-4 py-3 font-mono text-meta text-text-muted">
                                    {product.sku}
                                </td>
                                <td className="px-4 py-3 font-medium text-text">
                                    {product.name}
                                </td>
                                <td className="px-4 py-3 text-text-muted">
                                    {product.category}
                                </td>
                                <td className="px-4 py-3 text-right tabular-nums">
                                    {currencyFormatter.format(
                                        product.priceInCents / 100,
                                    )}
                                </td>
                                <td className="px-4 py-3 text-right tabular-nums">
                                    {product.stock}
                                </td>
                                <td className="px-4 py-3">
                                    <Badge variant={status.variant}>
                                        {status.label}
                                    </Badge>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
