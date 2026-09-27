export function Footer() {
    return (
        <footer className="flex justify-center px-4 pb-6 pt-8">
            <a
                href="https://arthurlabs.io"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-sm text-[13px] leading-5 text-text-muted opacity-75 transition-[opacity,color] hover:text-text hover:opacity-100 focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-4"
            >
                <img
                    src="/assets/lab-logo.svg"
                    alt=""
                    className="h-[18px] w-4 object-contain"
                />
                <span>
                    um experimento{' '}
                    <strong className="font-semibold">ArthurLabs</strong>
                </span>
            </a>
        </footer>
    )
}
