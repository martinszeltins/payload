import { deleteApiKey } from '../database/db'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (!body || !body.id) {
        throw createError({
            statusCode: 400,
            message: 'Bad request. "id" field is required.'
        })
    }

    try {
        deleteApiKey(body.id)
        return {
            success: true,
            message: 'API key deleted successfully'
        }
    }
    catch (error) {
        console.error('Failed to delete API key:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to delete API key'
        })
    }
})
