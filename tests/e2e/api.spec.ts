import { test, expect } from '@playwright/test'

test.describe('API Endpoints', () => {
    test('should create log via API', async ({ request }) => {
        const response = await request.post('/api/log', {
            data: {
                message: 'Test log from API',
                level: 'INFO'
            }
        })
        
        expect(response.ok()).toBeTruthy()
        const data = await response.json()
        expect(data.success).toBe(true)
    })

    test('should fetch logs via API', async ({ request }) => {
        const response = await request.get('/api/logs', {
            params: {
                limit: 10,
                offset: 0
            }
        })
        
        expect(response.ok()).toBeTruthy()
        const data = await response.json()
        expect(data).toHaveProperty('logs')
        expect(data).toHaveProperty('total')
        expect(Array.isArray(data.logs)).toBeTruthy()
    })

    test('should respect rate limiting', async ({ request }) => {
        // Make many requests quickly
        const requests = []
        for (let i = 0; i < 110; i++) {
            requests.push(
                request.post('/api/log', {
                    data: {
                        message: `Rate limit test ${i}`,
                        level: 'DEBUG'
                    }
                })
            )
        }
        
        const responses = await Promise.all(requests)
        
        // At least one should be rate limited
        const rateLimited = responses.some(r => r.status() === 429)
        expect(rateLimited).toBeTruthy()
    })

    test('should validate log data', async ({ request }) => {
        const response = await request.post('/api/log', {
            data: {
                // Missing required message field
                level: 'INFO'
            }
        })
        
        expect(response.status()).toBe(400)
    })
})
