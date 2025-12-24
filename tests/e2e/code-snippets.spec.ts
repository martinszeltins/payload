import { test, expect } from '@playwright/test'

test.describe('Code Snippets Modal', () => {
    test('should open code snippets modal', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        // Click code snippets button
        await page.getByRole('button', { name: 'Code Snippets' }).click()
        
        // Verify modal opened
        await expect(page.getByRole('heading', { name: 'Code Snippets', exact: true })).toBeVisible()
        await expect(page.getByText('Copy these snippets to send logs from your applications')).toBeVisible()
    })

    test('should display cURL snippet', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        // Open code snippets modal
        await page.getByRole('button', { name: 'Code Snippets' }).click()
        
        // Verify cURL tab exists
        const curlTab = page.getByRole('button', { name: 'CURL', exact: true })
        await expect(curlTab).toBeVisible()
        // Verify curl command is visible (first occurrence)
        await expect(page.getByText('curl -X POST http://localhost').first()).toBeVisible()
    })

    test('should display JavaScript snippet', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        // Open code snippets modal
        await page.getByRole('button', { name: 'Code Snippets' }).click()
        
        // Click JavaScript tab
        await page.getByRole('button', { name: 'JAVASCRIPT', exact: true }).click()
        
        // Verify JavaScript snippet exists
        await expect(page.getByText('fetch(', { exact: false })).toBeVisible()
    })

    test('should display PHP snippet', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        // Open code snippets modal
        await page.getByRole('button', { name: 'Code Snippets' }).click()
        
        // Click PHP tab (use last button matching PHP to avoid the Copy button)
        await page.locator('button', { hasText: /^PHP$/ }).last().click()
        
        // Verify PHP snippet exists
        await expect(page.getByText('file_get_contents', { exact: false }).first()).toBeVisible()
    })

    test('should copy snippet to clipboard', async ({ page, context }) => {
        // Grant clipboard permissions
        await context.grantPermissions(['clipboard-read', 'clipboard-write'])
        
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        // Open code snippets modal
        await page.getByRole('button', { name: 'Code Snippets' }).click()
        await expect(page.getByRole('heading', { name: 'Code Snippets', exact: true })).toBeVisible()
        
        // Wait a bit for modal to fully render
        await page.waitForTimeout(300)
        
        // Find the modal and click the first Copy button inside it
        const modal = page.locator('.fixed.inset-0').first()
        const copyButton = modal.getByRole('button', { name: 'Copy' }).first()
        await copyButton.click()
        
        // Wait for copy action
        await page.waitForTimeout(500)
        
        // Verify clipboard contains curl command
        const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
        expect(clipboardText).toContain('curl')
    })

    test('should close modal with ESC key', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        // Open code snippets modal
        await page.getByRole('button', { name: 'Code Snippets' }).click()
        await expect(page.getByRole('heading', { name: 'Code Snippets', exact: true })).toBeVisible()
        
        // Press ESC
        await page.keyboard.press('Escape')
        await page.waitForTimeout(200)
        
        // Verify modal closed
        await expect(page.getByRole('heading', { name: 'Code Snippets', exact: true })).not.toBeVisible()
    })

    test('should close modal with close button', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        // Open code snippets modal
        await page.getByRole('button', { name: 'Code Snippets' }).click()
        await expect(page.getByRole('heading', { name: 'Code Snippets', exact: true })).toBeVisible()
        
        // Click close button (X icon button at top right)
        const modal = page.locator('.fixed.inset-0').first()
        await modal.getByRole('button').first().click()
        await page.waitForTimeout(200)
        
        // Verify modal closed
        await expect(page.getByRole('heading', { name: 'Code Snippets', exact: true })).not.toBeVisible()
    })
})
