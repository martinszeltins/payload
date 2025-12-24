import { test, expect } from '@playwright/test'

test.describe('IP Whitelist Management', () => {
    test('should open IP whitelist modal', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        // Click IP Whitelist button
        await page.getByRole('button', { name: /IP Whitelist/ }).click()
        
        // Verify modal opened
        await expect(page.getByRole('heading', { name: 'IP Whitelist', exact: true })).toBeVisible()
        await expect(page.getByText('Manage IP addresses allowed to send logs without API keys')).toBeVisible()
    })

    test('should add new IP address', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        // Open IP whitelist modal
        await page.getByRole('button', { name: /IP Whitelist/ }).click()
        
        // Wait for modal
        await expect(page.getByRole('heading', { name: 'IP Whitelist', exact: true })).toBeVisible()
        
        // Enter IP address
        await page.getByPlaceholder('IP address (e.g., 192.168.1.1)').fill('192.168.1.100')
        
        // Click add button
        await page.getByRole('button', { name: 'Add IP Address' }).click()
        
        // Wait for IP to appear
        await page.waitForTimeout(500)
        
        // Verify IP was added
        await expect(page.getByText('192.168.1.100')).toBeVisible()
    })

    test('should validate IP address format', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        // Open IP whitelist modal
        await page.getByRole('button', { name: /IP Whitelist/ }).click()
        await expect(page.getByRole('heading', { name: 'IP Whitelist', exact: true })).toBeVisible()
        
        // Try to add invalid IP
        await page.getByPlaceholder('IP address (e.g., 192.168.1.1)').fill('invalid-ip')
        await page.getByRole('button', { name: 'Add IP Address' }).click()
        
        // Wait a moment
        await page.waitForTimeout(500)
        
        // Verify error or that IP wasn't added
        const invalidIp = await page.getByText('invalid-ip', { exact: true }).count()
        expect(invalidIp).toBe(0)
    })

    test('should delete IP address', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        // Open IP whitelist modal
        await page.getByRole('button', { name: /IP Whitelist/ }).click()
        await expect(page.getByRole('heading', { name: 'IP Whitelist', exact: true })).toBeVisible()
        
        // Add a test IP first
        await page.getByPlaceholder('IP address (e.g., 192.168.1.1)').fill('10.0.0.50')
        await page.getByRole('button', { name: 'Add IP Address' }).click()
        await page.waitForTimeout(500)
        
        // Verify IP exists
        await expect(page.getByText('10.0.0.50')).toBeVisible()
        
        // Find all delete buttons and click the one for our IP (should be last one)
        const deleteButtons = page.getByRole('button', { name: 'Delete' })
        const count = await deleteButtons.count()
        if (count > 0) {
            await deleteButtons.last().click()
            await page.waitForTimeout(500)
        }
    })

    test('should close modal with ESC key', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        // Open IP whitelist modal
        await page.getByRole('button', { name: /IP Whitelist/ }).click()
        await expect(page.getByRole('heading', { name: 'IP Whitelist', exact: true })).toBeVisible()
        
        // Press ESC
        await page.keyboard.press('Escape')
        await page.waitForTimeout(200)
        
        // Verify modal closed
        await expect(page.getByRole('heading', { name: 'IP Whitelist', exact: true })).not.toBeVisible()
    })
})
