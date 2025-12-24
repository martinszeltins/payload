import { getApiKeys, isIpWhitelisted } from '../database/db'
import { getClientIp } from '../utils/helpers'

export default defineEventHandler(async (event) => {
    // Check if the requesting IP is whitelisted
    const clientIp = getClientIp(event)
    const isWhitelisted = isIpWhitelisted(clientIp)

    if (!isWhitelisted) {
        throw createError({
            statusCode: 403,
            message: 'Forbidden. Only whitelisted IPs can view API keys.'
        })
    }

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
