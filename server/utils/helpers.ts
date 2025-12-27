export function getClientIp(event: any): string {
    const headers = event.node.req.headers
    
    // Check Cloudflare header first (most reliable when using Cloudflare)
    const cfConnectingIp = headers['cf-connecting-ip']
    if (cfConnectingIp) {
        return typeof cfConnectingIp === 'string' ? cfConnectingIp : cfConnectingIp[0]
    }
    
    // Check common headers for real IP
    const forwarded = headers['x-forwarded-for']
    if (forwarded) {
        const ips = (typeof forwarded === 'string' ? forwarded : forwarded[0]).split(',')
        return ips[0].trim()
    }

    const realIp = headers['x-real-ip']
    if (realIp) {
        return typeof realIp === 'string' ? realIp : realIp[0]
    }

    return event.node.req.socket.remoteAddress || 'unknown'
}

export function sanitizeInput(input: any): string {
    if (typeof input !== 'string') {
        return JSON.stringify(input)
    }
    return input
}
