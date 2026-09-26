import 'dotenv/config'

import cors from 'cors'
import express from 'express'

import { errorHandler } from './middlewares/error-handler.js'
import { limiter } from './middlewares/rate-limit.js'
import { productsRouter } from './routes/products.js'
import { reportsRouter } from './routes/reports.js'

const app = express()

app.use(
    cors({
        origin: process.env.WEB_URL ?? 'http://localhost:5173',
    }),
)

app.use(express.json())

app.use(limiter)

const port = Number(process.env.PORT) || 3333

app.get('/health', (_request, response) => {
    return response.status(200).json({
        status: 'ok',
    })
})

app.use('/products', productsRouter)

app.use('/reports', reportsRouter)

app.use(errorHandler)

app.listen(port, () => {
    console.log(`HTTP server running on http://localhost:${port}`)
})
