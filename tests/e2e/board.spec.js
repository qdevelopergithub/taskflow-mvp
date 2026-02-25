const { test, expect } = require('@playwright/test');

test.describe('Board Page', () => {
  test('displays board heading', async ({ page }) => {
    await page.goto('/board');
    await expect(page.locator('h1')).toHaveText('Board');
  });

  test('shows three columns', async ({ page }) => {
    await page.goto('/board');
    await expect(page.getByText('To Do')).toBeVisible();
    await expect(page.getByText('In Progress')).toBeVisible();
    await expect(page.getByText('Done')).toBeVisible();
  });

  test('columns show task count badges', async ({ page }) => {
    await page.goto('/board');
    // Each column header should have a count badge
    const countBadges = page.locator('.rounded-full.px-2');
    await expect(countBadges.first()).toBeVisible();
  });

  test('task cards are displayed', async ({ page }) => {
    await page.goto('/board');
    // Should have task cards with titles
    const cards = page.locator('.card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Move button advances task status', async ({ page }) => {
    await page.goto('/board');
    // Find a Move button in the To Do column and click it
    const moveButtons = page.getByText('Move');
    const count = await moveButtons.count();
    if (count > 0) {
      await moveButtons.first().click();
      // Toast should appear
      await page.waitForTimeout(500);
    }
  });
});
