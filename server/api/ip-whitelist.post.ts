import { insertIpWhitelist, isIpWhitelisted } from '../database/db'
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

    if (!body || !body.ip_address) {
        throw createError({
            statusCode: 400,
            message: 'Bad request. "ip_address" field is required.'
        })
    }

    // Basic IP validation
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/
    if (!ipPattern.test(body.ip_address)) {
        throw createError({
            statusCode: 400,
            message: 'Invalid IP address format'
        })
    }

    try {
        insertIpWhitelist(body.ip_address, body.description)
        return {
            success: true,
            message: 'IP address added to whitelist'
        }
    }
    catch (error) {
        console.error('Failed to add IP to whitelist:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to add IP to whitelist'
        })
    }
})
