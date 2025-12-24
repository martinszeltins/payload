import { test, expect } from '@playwright/test'

test.describe('Log Management', () => {
    test('should create a log via UI', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        // Click Add Log button
        await page.click('button:has-text("Add Log")')
        await page.waitForTimeout(300)
        
        // Fill in log details
        await page.fill('input[placeholder="Log message..."]', 'Test log from E2E')
        await page.selectOption('select', 'INFO')
        
        // Submit
        await page.click('button:has-text("Send")')
        
        // Wait a bit for optimistic update
        await page.waitForTimeout(500)
        
        // Check if log appears (optimistic update)
        await expect(page.locator('text=Test log from E2E')).toBeVisible()
    })

    test.skip('should filter logs by search term', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        // Create a unique log first
        const uniqueMessage = `Searchable log ${Date.now()}`
        await page.click('button:has-text("Add Log")')
        await page.waitForTimeout(300)
        await page.fill('input[placeholder="Log message..."]', uniqueMessage)
        await page.click('button:has-text("Send")')
        await page.waitForTimeout(800) // Wait longer for log to be created and visible
        
        // Now search for it
        await page.fill('input[placeholder="Search logs..."]', uniqueMessage)
        await page.waitForTimeout(1200) // Wait for debounce
        
        // Should find the log - verify by checking if there's at least one result
        const logCount = await page.locator('[data-testid="log-entry"]').count()
        expect(logCount).toBeGreaterThan(0)
    })

    test('should filter logs by level', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        // Select ERROR level filter
        await page.selectOption('select', 'ERROR')
        await page.waitForTimeout(500)
        
        // If there are any logs, they should all be ERROR level
        const errorBadges = page.locator('text=ERROR')
        const count = await errorBadges.count()
        
        // Verify no other levels are shown
        if (count > 0) {
            await expect(page.locator('text=INFO').first()).not.toBeVisible()
        }
    })

    test('should close create form with ESC key', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        // Open form
        await page.click('button:has-text("Add Log")')
        await page.waitForTimeout(300)
        await expect(page.locator('input[placeholder="Log message..."]')).toBeVisible()
        
        // Press ESC
        await page.keyboard.press('Escape')
        await page.waitForTimeout(200)
        
        // Form should be closed
        await expect(page.locator('input[placeholder="Log message..."]')).not.toBeVisible()
    })
})
