import { test, expect } from '@playwright/test'

test.describe('Pagination', () => {
    test.beforeEach(async ({ request }) => {
        // Create multiple logs for pagination testing
        const promises = []
        for (let i = 0; i < 35; i++) {
            promises.push(
                request.post('/api/log', {
                    data: {
                        message: `Pagination test log ${i}`,
                        level: 'INFO'
                    }
                })
            )
        }
        await Promise.all(promises)
    })

    test('should show pagination controls', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        // Wait for logs to load
        await page.waitForSelector('[data-testid="log-entry"]', { timeout: 5000 })
        
        // Verify pagination controls exist
        await expect(page.locator('text=Previous')).toBeVisible()
        await expect(page.locator('text=Next')).toBeVisible()
    })

    test('should navigate to next page', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        // Wait for logs to load
        await page.waitForSelector('[data-testid="log-entry"]', { timeout: 5000 })
        
        // Get first log text on page 1
        const firstLogPage1 = await page.locator('[data-testid="log-entry"]').first().textContent()
        
        // Click next button
        await page.click('button:has-text("Next")')
        
        // Wait for page to update
        await page.waitForTimeout(500)
        
        // Get first log text on page 2
        const firstLogPage2 = await page.locator('[data-testid="log-entry"]').first().textContent()
        
        // Verify logs changed
        expect(firstLogPage1).not.toBe(firstLogPage2)
    })

    test('should navigate back to previous page', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        // Wait for logs to load
        await page.waitForSelector('[data-testid="log-entry"]', { timeout: 5000 })
        
        // Get first log on page 1
        const firstLogPage1 = await page.locator('[data-testid="log-entry"]').first().textContent()
        
        // Go to page 2
        await page.click('button:has-text("Next")')
        await page.waitForTimeout(500)
        
        // Go back to page 1
        await page.click('button:has-text("Previous")')
        await page.waitForTimeout(500)
        
        // Verify we're back on page 1
        const firstLogBack = await page.locator('[data-testid="log-entry"]').first().textContent()
        expect(firstLogBack).toBe(firstLogPage1)
    })

    test('should display correct page information', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        // Wait for logs to load
        await page.waitForSelector('[data-testid="log-entry"]', { timeout: 5000 })
        
        // Look for page info (e.g., "Page 1 of X")
        const pageInfo = await page.getByText(/Page \d+ of \d+/).textContent()
        expect(pageInfo).toBeTruthy()
    })
})
