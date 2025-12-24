import { getApiKeys } from '../database/db'

export default defineEventHandler(async () => {
    try {
        const apiKeys = getApiKeys()
        return apiKeys
    }
    catch (error) {
        console.error('Failed to fetch API keys:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to fetch API keys'
        })
    }
})
