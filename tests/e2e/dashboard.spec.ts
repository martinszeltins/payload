import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
    test('should load the dashboard page', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        // Check page title and main elements
        await expect(page.getByText('Log Dashboard', { exact: true })).toBeVisible()
        await expect(page.getByText('Logs', { exact: true })).toBeVisible()
        await expect(page.getByRole('button', { name: 'Refresh' })).toBeVisible()
        await expect(page.getByRole('button', { name: 'Add Log' })).toBeVisible()
    })

    test('should display filter controls', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        // Check filter inputs
        await expect(page.locator('input[placeholder="Search logs..."]')).toBeVisible()
        await expect(page.locator('select').first()).toBeVisible() // Log Level
        await expect(page.locator('select').nth(1)).toBeVisible() // Time Range
    })

    test('should show sidebar navigation', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        // Check sidebar links
        await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible()
        await expect(page.getByRole('button', { name: /API Keys/ })).toBeVisible()
        await expect(page.getByRole('button', { name: /IP Whitelist/ })).toBeVisible()
        await expect(page.getByRole('button', { name: 'Code Snippets' })).toBeVisible()
    })
})
