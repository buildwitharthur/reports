import { FileText } from 'lucide-react'
import { useState } from 'react'

import { GenerateReportDialog } from './generate-report-dialog'
import { ProductFilters } from './product-filters'
import { Button } from './ui/button'

export function ProductsHeader() {
    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)

    return (
        <section className="grid gap-6">
            <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <h1 className="text-title tracking-[-0.01em]">Produtos</h1>
                    <p className="mt-1 text-body text-text-muted">
                        Visualize o catálogo e gere relatórios em PDF.
                    </p>
                </div>

                <Button
                    className="w-full sm:w-auto"
                    onClick={() => setIsReportDialogOpen(true)}
                >
                    <FileText size={16} aria-hidden="true" />
                    Gerar relatório
                </Button>
            </div>

            <ProductFilters />

            <GenerateReportDialog
                open={isReportDialogOpen}
                onOpenChange={setIsReportDialogOpen}
            />
        </section>
    )
}
