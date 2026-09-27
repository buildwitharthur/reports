import { useState } from 'react'

import { Alert } from './components/ui/alert'
import { Badge } from './components/ui/badge'
import { Button } from './components/ui/button'
import { Checkbox } from './components/ui/checkbox'
import { Dialog } from './components/ui/dialog'
import { IconButton } from './components/ui/icon-button'
import { Input } from './components/ui/input'
import { RadioOption } from './components/ui/radio-option'
import { Select } from './components/ui/select'
import { Skeleton } from './components/ui/skeleton'
import { Spinner } from './components/ui/spinner'

export function App() {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedScope, setSelectedScope] = useState('all')
    const [includeSummary, setIncludeSummary] = useState(true)

    return (
        <main className="min-h-screen bg-bg px-6 py-12 text-text font-sans">
            <div className="mx-auto flex max-w-5xl flex-col gap-10">
                <header>
                    <p className="text-meta text-text-muted">ReportForge</p>
                    <h1 className="mt-1 text-display">UI primitives</h1>
                    <p className="mt-2 max-w-2xl text-body text-text-muted">
                        Demonstração temporária dos componentes básicos da interface.
                    </p>
                </header>

                <section className="grid gap-6 rounded-lg border border-line bg-surface p-6">
                    <h2 className="text-heading">Button</h2>
                    <div className="flex flex-wrap items-center gap-3">
                        <Button>Gerar relatório</Button>
                        <Button variant="secondary">Cancelar</Button>
                        <Button size="sm">Small</Button>
                        <Button size="lg">Large</Button>
                        <Button loading>Gerando relatório...</Button>
                        <Button disabled>Desabilitado</Button>
                    </div>
                </section>

                <section className="grid gap-6 rounded-lg border border-line bg-surface p-6">
                    <h2 className="text-heading">IconButton, Spinner e Skeleton</h2>
                    <div className="flex flex-wrap items-center gap-3">
                        <IconButton aria-label="Fechar">×</IconButton>
                        <IconButton aria-label="Anterior">←</IconButton>
                        <IconButton aria-label="Próximo" disabled>
                            →
                        </IconButton>
                        <Spinner className="text-brand-500" />
                        <Spinner className="size-5 text-accent-text" />
                    </div>
                    <div className="grid max-w-md gap-3">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                </section>

                <section className="grid gap-6 rounded-lg border border-line bg-surface p-6">
                    <h2 className="text-heading">Input, Select e Checkbox</h2>
                    <div className="grid max-w-xl gap-3 sm:grid-cols-2">
                        <Input placeholder="Buscar produtos..." />
                        <Input value="Campo desabilitado" disabled readOnly />
                        <Select defaultValue="all">
                            <option value="all">Todas as categorias</option>
                            <option value="monitores">Monitores</option>
                            <option value="notebooks">Notebooks</option>
                        </Select>
                        <label className="flex items-center gap-2 text-small text-text">
                            <Checkbox
                                checked={includeSummary}
                                onChange={(event) =>
                                    setIncludeSummary(event.target.checked)
                                }
                            />
                            Incluir resumo
                        </label>
                    </div>
                </section>

                <section className="grid gap-6 rounded-lg border border-line bg-surface p-6">
                    <h2 className="text-heading">Badge</h2>
                    <div className="flex flex-wrap items-center gap-3">
                        <Badge variant="success">Ativo</Badge>
                        <Badge variant="warning">Sem estoque</Badge>
                        <Badge variant="neutral">Inativo</Badge>
                        <Badge variant="danger">Erro</Badge>
                    </div>
                </section>

                <section className="grid gap-3 rounded-lg border border-line bg-surface p-6">
                    <h2 className="mb-3 text-heading">Alert</h2>
                    <Alert variant="success" title="Relatório pronto">
                        O arquivo foi preparado para visualização.
                    </Alert>
                    <Alert variant="warning" title="Atenção">
                        Existem produtos sem estoque.
                    </Alert>
                    <Alert variant="info" title="Informação">
                        Os dados serão atualizados posteriormente.
                    </Alert>
                    <Alert variant="error" title="Não foi possível concluir">
                        Tente novamente em alguns instantes.
                    </Alert>
                </section>

                <section className="grid gap-6 rounded-lg border border-line bg-surface p-6">
                    <h2 className="text-heading">RadioOption e Dialog</h2>
                    <div className="grid max-w-xl gap-3">
                        <RadioOption
                            name="scope"
                            value="all"
                            title="Todos os produtos"
                            description="Inclui todo o catálogo disponível."
                            checked={selectedScope === 'all'}
                            onChange={(event) => setSelectedScope(event.target.value)}
                        />
                        <RadioOption
                            name="scope"
                            value="filtered"
                            title="Resultados filtrados"
                            description="Usa somente os filtros aplicados."
                            checked={selectedScope === 'filtered'}
                            onChange={(event) => setSelectedScope(event.target.value)}
                        />
                        <RadioOption
                            name="scope"
                            value="disabled"
                            title="Opção indisponível"
                            description="Estado desabilitado."
                            disabled
                        />
                    </div>
                    <Button className="w-fit" onClick={() => setDialogOpen(true)}>
                        Abrir dialog
                    </Button>
                </section>
            </div>

            <Dialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                title="Gerar relatório"
                description="Exemplo do primitive de modal do ReportForge."
            >
                <div className="grid gap-4">
                    <RadioOption
                        name="dialog-scope"
                        value="all"
                        title="Todos os produtos"
                        description="Demonstração de uma opção selecionada."
                        defaultChecked
                    />
                    <Select defaultValue="name" aria-label="Ordenação">
                        <option value="name">Ordenar por nome</option>
                        <option value="price">Ordenar por preço</option>
                    </Select>
                    <label className="flex items-center gap-2 text-small">
                        <Checkbox defaultChecked />
                        Incluir resumo geral
                    </label>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => setDialogOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button onClick={() => setDialogOpen(false)}>
                            Confirmar
                        </Button>
                    </div>
                </div>
            </Dialog>
        </main>
    )
}
