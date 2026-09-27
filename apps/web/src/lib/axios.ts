import axios from 'axios'

type ApiErrorResponse = {
    error?: string
}

const FALLBACK_ERROR_MESSAGE = 'Erro inesperado ao comunicar com a API.'

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
        if (axios.isAxiosError<ApiErrorResponse>(error)) {
            const message =
                error.response?.data?.error ||
                error.message ||
                FALLBACK_ERROR_MESSAGE

            return Promise.reject(new Error(message))
        }

        if (error instanceof Error) {
            return Promise.reject(error)
        }

        return Promise.reject(new Error(FALLBACK_ERROR_MESSAGE))
    },
)
