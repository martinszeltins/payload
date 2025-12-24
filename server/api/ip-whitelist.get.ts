import { getIpWhitelist } from '../database/db'

export default defineEventHandler(async () => {
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
