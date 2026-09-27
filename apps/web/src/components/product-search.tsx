import { useEffect, useState } from 'react'

import { Input } from './ui/input'

type ProductSearchProps = {
    value: string
    onValueChange: (value: string) => void
    className?: string
}

export function ProductSearch({
    value,
    onValueChange,
    className,
}: ProductSearchProps) {
    const [inputValue, setInputValue] = useState(value)

    useEffect(() => {
        setInputValue(value)
    }, [value])

    return (
        <Input
            aria-label="Buscar produtos"
            className={className}
            placeholder="Buscar por nome ou SKU"
            value={inputValue}
            onChange={(event) => {
                const newValue = event.target.value

                setInputValue(newValue)
                onValueChange(newValue)
            }}
        />
    )
}
