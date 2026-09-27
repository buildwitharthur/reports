import { Select } from './ui/select'

export type FilterSelectOption<Value extends string = string> = {
    value: Value
    label: string
}

type FilterSelectProps<Value extends string> = {
    value: Value
    options: readonly FilterSelectOption<Value>[]
    onValueChange: (value: Value) => void
    ariaLabel: string
    className?: string
}

export function FilterSelect<Value extends string>({
    value,
    options,
    onValueChange,
    ariaLabel,
    className,
}: FilterSelectProps<Value>) {
    return (
        <Select
            aria-label={ariaLabel}
            className={className}
            value={value}
            onChange={(event) =>
                onValueChange(event.target.value as Value)
            }
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </Select>
    )
}
