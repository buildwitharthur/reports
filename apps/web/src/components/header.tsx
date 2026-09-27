export function Header() {
    return (
        <header className="flex h-16 shrink-0 items-center px-4 md:px-8">
            <a
                href="/"
                aria-label="ReportForge"
                className="flex items-center gap-2.5 rounded-sm text-text outline-none focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-4"
            >
                <img
                    src="/assets/lab-logo.svg"
                    alt=""
                    className="h-6 w-[22px] object-contain"
                />
                <span className="text-base font-semibold tracking-[-0.01em]">
                    ReportForge
                </span>
            </a>
        </header>
    )
}
