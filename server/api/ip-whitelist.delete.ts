import { deleteIpWhitelist } from '../database/db'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (!body || !body.id) {
        throw createError({
            statusCode: 400,
            message: 'Bad request. "id" field is required.'
        })
    }

    try {
        deleteIpWhitelist(body.id)
        return {
            success: true,
            message: 'IP address removed from whitelist'
        }
    }
    catch (error) {
        console.error('Failed to remove IP from whitelist:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to remove IP from whitelist'
        })
    }
})
