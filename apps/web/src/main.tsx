import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import { QueryClientIntegration } from './integrations/query-client'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientIntegration>
            <main className="min-h-screen bg-bg text-text font-sans">
                <h1 className="text-title">ReportForge</h1>
            </main>
        </QueryClientIntegration>
    </StrictMode>,
)
