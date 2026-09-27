import type { ReactNode } from 'react'

import { NuqsAdapter } from 'nuqs/adapters/react'

type NuqsIntegrationProps = {
    children: ReactNode
}

export function NuqsIntegration({
    children,
}: NuqsIntegrationProps) {
    return (
        <NuqsAdapter>
            {children}
        </NuqsAdapter>
    )
}
