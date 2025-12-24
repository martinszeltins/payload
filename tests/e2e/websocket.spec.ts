import { test, expect } from '@playwright/test'

test.describe('WebSocket Real-time Updates', () => {
    test.skip('should receive new logs via WebSocket', async ({ page }) => {
        // Navigate to dashboard
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        // Wait for WebSocket connection
        await page.waitForTimeout(1000)
        
        // Create a unique log via the UI
        const uniqueMessage = `WebSocket test ${Date.now()}`
        await page.click('button:has-text("Add Log")')
        await page.waitForTimeout(300)
        await page.fill('input[placeholder="Log message..."]', uniqueMessage)
        await page.click('button:has-text("Send")')
        
        // Wait for optimistic update + WebSocket update
        await page.waitForTimeout(1000)
        
        // Verify new log appeared
        await expect(page.locator('[data-testid="log-entry"]').first()).toContainText(uniqueMessage)
    })
})
