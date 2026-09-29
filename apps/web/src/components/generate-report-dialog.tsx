import { useQueryStates } from 'nuqs'

import { productQueryParams } from '../lib/product-query-params'
import { Button } from './ui/button'
import { Dialog } from './ui/dialog'

type GenerateReportDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function GenerateReportDialog({
    open,
    onOpenChange,
}: GenerateReportDialogProps) {
    const [params] = useQueryStates(productQueryParams)

    function handleGenerateReport() {
        const searchParams = new URLSearchParams()

        if (params.search) {
            searchParams.set('search', params.search)
        }

        if (params.category !== 'all') {
            searchParams.set('category', params.category)
        }

        if (params.status !== 'all') {
            searchParams.set('status', params.status)
        }

        if (params.inStock !== 'all') {
            searchParams.set('inStock', params.inStock)
        }

        const apiUrl = import.meta.env.VITE_API_URL

        const queryString = searchParams.toString()

        const reportUrl = queryString
            ? `${apiUrl}/products/csv?${queryString}`
            : `${apiUrl}/products/csv`

        window.open(reportUrl, '_blank', 'noopener,noreferrer')

        onOpenChange(false)
    }

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
            title="Gerar relatório"
            description="O relatório será baixado em CSV utilizando os filtros atuais."
        >
            <div className="flex justify-end gap-2">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => onOpenChange(false)}
                >
                    Cancelar
                </Button>

                <Button type="button" onClick={handleGenerateReport}>
                    Gerar relatório
                </Button>
            </div>
        </Dialog>
    )
}
