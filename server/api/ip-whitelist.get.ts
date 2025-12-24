import { getIpWhitelist, isIpWhitelisted } from '../database/db'
import { getClientIp } from '../utils/helpers'

export default defineEventHandler(async (event) => {
    // Check if the requesting IP is whitelisted
    const clientIp = getClientIp(event)
    const isWhitelisted = isIpWhitelisted(clientIp)

    if (!isWhitelisted) {
        throw createError({
            statusCode: 403,
            message: 'Forbidden. Only whitelisted IPs can view the whitelist.'
        })
    }

    try {
        const ipWhitelist = getIpWhitelist()
        return ipWhitelist
    }
    catch (error) {
        console.error('Failed to fetch IP whitelist:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to fetch IP whitelist'
        })
    }
})
