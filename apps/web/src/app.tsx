import { Footer } from './components/footer'
import { Header } from './components/header'
import { ProductsHeader } from './components/products-header'
import { ProductsList } from './components/products-list'

export function App() {
    return (
        <div className="flex min-h-screen flex-col bg-bg text-text font-sans">
            <Header />

            <main className="mx-auto w-full max-w-[1264px] flex-1 px-4 py-12 md:px-8">
                <ProductsHeader />
                <div className="mt-8">
                    <ProductsList />
                </div>
            </main>

            <Footer />
        </div>
    )
}
