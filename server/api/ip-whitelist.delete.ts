import { deleteIpWhitelist, isIpWhitelisted } from '../database/db'
import { getClientIp } from '../utils/helpers'

export default defineEventHandler(async (event) => {
    // Check if the requesting IP is whitelisted
    const clientIp = getClientIp(event)
    const isWhitelisted = isIpWhitelisted(clientIp)

    if (!isWhitelisted) {
        throw createError({
            statusCode: 403,
            message: 'Forbidden. Only whitelisted IPs can manage the whitelist.'
        })
    }

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
