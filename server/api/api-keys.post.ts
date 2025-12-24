import { insertApiKey, isIpWhitelisted } from '../database/db'
import { randomBytes } from 'crypto'
import { getClientIp } from '../utils/helpers'

export default defineEventHandler(async (event) => {
    // Check if the requesting IP is whitelisted
    const clientIp = getClientIp(event)
    const isWhitelisted = isIpWhitelisted(clientIp)

    if (!isWhitelisted) {
        throw createError({
            statusCode: 403,
            message: 'Forbidden. Only whitelisted IPs can manage API keys.'
        })
    }

    const body = await readBody(event)

    if (!body || !body.name) {
        throw createError({
            statusCode: 400,
            message: 'Bad request. "name" field is required.'
        })
    }

    // Generate a secure random API key
    const apiKey = randomBytes(32).toString('hex')

    try {
        insertApiKey(apiKey, body.name)
        return {
            success: true,
            key: apiKey,
            name: body.name
        }
    }
    catch (error) {
        console.error('Failed to create API key:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to create API key'
        })
    }
})
