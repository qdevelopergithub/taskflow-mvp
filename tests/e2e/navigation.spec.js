const { test, expect } = require('@playwright/test');

test.describe('Navigation', () => {
  test('navbar shows TaskFlow logo', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('TaskFlow')).toBeVisible();
    await expect(page.locator('text=TF')).toBeVisible();
  });

  test('navigates to Board page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Board/ }).first().click();
    await expect(page).toHaveURL('/board');
    await expect(page.locator('h1')).toHaveText('Board');
  });

  test('navigates to Tasks page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Tasks/ }).first().click();
    await expect(page).toHaveURL('/tasks');
    await expect(page.locator('h1')).toHaveText('Tasks');
  });

  test('navigates to Dashboard from nav', async ({ page }) => {
    await page.goto('/tasks');
    await page.getByRole('link', { name: /Dashboard/ }).first().click();
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toHaveText('Dashboard');
  });

  test('New Task button opens task form', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /New Task/ }).first().click();
    await expect(page).toHaveURL('/tasks/new');
    await expect(page.locator('h1')).toHaveText('New Task');
  });
});
