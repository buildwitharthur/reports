import { Skeleton } from './ui/skeleton'

const skeletonRows = Array.from({ length: 6 }, (_, index) => index)

export function ProductsTableSkeleton() {
    return (
        <div className="overflow-x-auto rounded-lg border border-line bg-surface">
            <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                    <tr className="border-b border-line text-meta text-text-muted">
                        <th className="px-4 py-3 font-medium">SKU</th>
                        <th className="px-4 py-3 font-medium">Produto</th>
                        <th className="px-4 py-3 font-medium">Categoria</th>
                        <th className="px-4 py-3 text-right font-medium">Preço</th>
                        <th className="px-4 py-3 text-right font-medium">Estoque</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {skeletonRows.map((row) => (
                        <tr key={row} className="border-b border-line last:border-b-0">
                            <td className="px-4 py-3">
                                <Skeleton className="h-3 w-20" />
                            </td>
                            <td className="px-4 py-3">
                                <Skeleton className="h-4 w-44" />
                            </td>
                            <td className="px-4 py-3">
                                <Skeleton className="h-4 w-28" />
                            </td>
                            <td className="px-4 py-3">
                                <Skeleton className="ml-auto h-4 w-20" />
                            </td>
                            <td className="px-4 py-3">
                                <Skeleton className="ml-auto h-4 w-8" />
                            </td>
                            <td className="px-4 py-3">
                                <Skeleton className="h-[22px] w-20 rounded-pill" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
