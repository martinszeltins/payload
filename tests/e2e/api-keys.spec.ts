import { test, expect } from '@playwright/test'

test.describe('API Keys Management', () => {
    test('should open API keys modal', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        // Click API Keys button
        await page.getByRole('button', { name: /API Keys/ }).click()
        
        // Verify modal opened
        await expect(page.getByRole('heading', { name: 'API Keys', exact: true })).toBeVisible()
        await expect(page.getByText('Manage API keys for accessing the logging API')).toBeVisible()
    })

    test('should create new API key', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        // Open API keys modal
        await page.getByRole('button', { name: /API Keys/ }).click()
        
        // Wait for modal to open
        await expect(page.getByRole('heading', { name: 'API Keys', exact: true })).toBeVisible()
        
        // Enter key name
        await page.getByPlaceholder('Key name...').fill('Test API Key')
        
        // Click create button
        await page.getByRole('button', { name: 'Create' }).click()
        
        // Wait for key to appear
        await page.waitForTimeout(500)
        
        // Verify key was created
        await expect(page.getByText('Test API Key').first()).toBeVisible()
    })

    test('should delete API key', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        // Open API keys modal
        await page.getByRole('button', { name: /API Keys/ }).click()
        await expect(page.getByRole('heading', { name: 'API Keys', exact: true })).toBeVisible()
        
        // Create a test key first
        await page.getByPlaceholder('Key name...').fill('Key to Delete')
        await page.getByRole('button', { name: 'Create' }).click()
        await page.waitForTimeout(500)
        
        // Verify key exists
        await expect(page.getByText('Key to Delete').first()).toBeVisible()
        
        // Find all delete buttons and click the one in the row with our key
        const deleteButtons = page.getByRole('button', { name: 'Delete' })
        const count = await deleteButtons.count()
        if (count > 0) {
            await deleteButtons.last().click() // Click the last delete button (our newly created key)
            await page.waitForTimeout(500)
        }
    })

    test('should close modal with ESC key', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        // Open API keys modal
        await page.getByRole('button', { name: /API Keys/ }).click()
        await expect(page.getByRole('heading', { name: 'API Keys', exact: true })).toBeVisible()
        
        // Press ESC
        await page.keyboard.press('Escape')
        
        // Verify modal closed
        await expect(page.getByRole('heading', { name: 'API Keys', exact: true })).not.toBeVisible()
    })
})
