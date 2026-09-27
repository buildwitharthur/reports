import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import { QueryClientIntegration } from './integrations/query-client'
import { App } from './app'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientIntegration>
            <App />
        </QueryClientIntegration>
    </StrictMode>,
)
