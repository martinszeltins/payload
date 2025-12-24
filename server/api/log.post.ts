import { insertLog, isIpWhitelisted, verifyApiKey } from '../database/db'
import { checkRateLimit } from '../utils/rateLimit'
import { getClientIp, sanitizeInput } from '../utils/helpers'
import { broadcastNewLog } from '../utils/websocket'

export default defineEventHandler(async (event) => {
    // Handle CORS preflight
    if (event.node.req.method === 'OPTIONS') {
        return {
            statusCode: 200
        }
    }

    // Only allow POST requests
    if (event.node.req.method !== 'POST') {
        throw createError({
            statusCode: 405,
            message: 'Method not allowed'
        })
    }

    const clientIp = getClientIp(event)

    // Check rate limiting
    if (!checkRateLimit(clientIp, 100, 60000)) {
        throw createError({
            statusCode: 429,
            message: 'Too many requests. Please try again later.'
        })
    }

    // Check authentication: IP whitelist or API key
    const apiKey = event.node.req.headers['x-api-key'] as string | undefined
    const isWhitelisted = isIpWhitelisted(clientIp)
    const hasValidApiKey = apiKey && verifyApiKey(apiKey)

    if (!isWhitelisted && !hasValidApiKey) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized. Please provide a valid API key or ensure your IP is whitelisted.'
        })
    }

    // Parse body
    const body = await readBody(event)

    if (!body || !body.message) {
        throw createError({
            statusCode: 400,
            message: 'Bad request. "message" field is required.'
        })
    }

    // Validate log level
    const validLevels = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']
    const level = body.level ? body.level.toUpperCase() : 'INFO'
    
    if (!validLevels.includes(level)) {
        throw createError({
            statusCode: 400,
            message: `Invalid log level. Must be one of: ${validLevels.join(', ')}`
        })
    }

    // Prepare log entry
    const log = {
        message: sanitizeInput(body.message),
        level: level as 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL',
        metadata: body.metadata ? sanitizeInput(body.metadata) : undefined,
        ip_address: clientIp,
        timestamp: Date.now()
    }

    // Insert log into database
    try {
        const insertedLog = insertLog(log)
        
        // Broadcast new log to all connected WebSocket clients
        broadcastNewLog(insertedLog)
        
        return {
            success: true,
            message: 'Log entry created successfully'
        }
    }
    catch (error) {
        console.error('Failed to insert log:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to create log entry'
        })
    }
})
