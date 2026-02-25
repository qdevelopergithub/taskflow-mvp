const { test, expect } = require('@playwright/test');

test.describe('Dashboard Page', () => {
  test('displays dashboard heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveText('Dashboard');
  });

  test('shows stat cards', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Total Tasks')).toBeVisible();
    await expect(page.locator('span').filter({ hasText: /^In Progress$/ })).toBeVisible();
    await expect(page.getByText('Completed')).toBeVisible();
    await expect(page.getByText('Completion Rate', { exact: true })).toBeVisible();
  });

  test('shows progress section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Progress' })).toBeVisible();
  });

  test('shows recent tasks section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Recent Tasks')).toBeVisible();
    await expect(page.getByText('View all')).toBeVisible();
  });

  test('navigates to tasks page via View all link', async ({ page }) => {
    await page.goto('/');
    await page.getByText('View all').click();
    await expect(page).toHaveURL('/tasks');
    await expect(page.locator('h1')).toHaveText('Tasks');
  });
});
