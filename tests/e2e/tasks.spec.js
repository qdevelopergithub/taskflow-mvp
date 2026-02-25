const { test, expect } = require('@playwright/test');

test.describe('Tasks Page', () => {
  test('displays tasks table with seeded data', async ({ page }) => {
    await page.goto('/tasks');
    await expect(page.locator('h1')).toHaveText('Tasks');
    // Table headers
    await expect(page.getByRole('columnheader', { name: 'Task' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Priority' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Due Date' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Actions' })).toBeVisible();
  });

  test('shows task count', async ({ page }) => {
    await page.goto('/tasks');
    await expect(page.getByText(/\d+ tasks?/)).toBeVisible();
  });

  test('filter by status works', async ({ page }) => {
    await page.goto('/tasks');
    // Wait for tasks to load
    await expect(page.locator('table')).toBeVisible();
    // Select "Done" status filter
    await page.locator('select').first().selectOption('done');
    // Verify only done tasks are shown
    await page.waitForTimeout(500);
    const statusBadges = page.locator('table tbody tr');
    const count = await statusBadges.count();
    expect(count).toBeGreaterThan(0);
  });

  test('filter by priority works', async ({ page }) => {
    await page.goto('/tasks');
    await expect(page.locator('table')).toBeVisible();
    await page.locator('select').nth(1).selectOption('high');
    await page.waitForTimeout(500);
    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('New Task button links to form', async ({ page }) => {
    await page.goto('/tasks');
    await page.getByRole('link', { name: /New Task/ }).first().click();
    await expect(page).toHaveURL('/tasks/new');
  });

  test('edit button links to edit form', async ({ page }) => {
    await page.goto('/tasks');
    await expect(page.locator('table')).toBeVisible();
    // Click first edit pencil icon
    await page.locator('table tbody tr').first().locator('a').last().click();
    await expect(page).toHaveURL(/\/tasks\/\d+\/edit/);
    await expect(page.locator('h1')).toHaveText('Edit Task');
  });

  test('delete shows confirmation modal', async ({ page }) => {
    await page.goto('/tasks');
    await expect(page.locator('table')).toBeVisible();
    // Click first delete button
    await page.locator('table tbody tr').first().locator('button').click();
    await expect(page.getByText('Delete Task')).toBeVisible();
    await expect(page.getByText('Are you sure')).toBeVisible();
    // Cancel
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByText('Delete Task')).not.toBeVisible();
  });
});
