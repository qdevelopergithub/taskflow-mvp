const { test, expect } = require('@playwright/test');

test.describe('Task Form - Create', () => {
  test('shows create form with correct heading', async ({ page }) => {
    await page.goto('/tasks/new');
    await expect(page.locator('h1')).toHaveText('New Task');
    await expect(page.getByText('Back to tasks')).toBeVisible();
  });

  test('validates title is required', async ({ page }) => {
    await page.goto('/tasks/new');
    await page.getByRole('button', { name: /Create Task/ }).click();
    await expect(page.getByText('Title is required')).toBeVisible();
  });

  test('creates a new task successfully', async ({ page }) => {
    await page.goto('/tasks/new');
    await page.getByLabel('Title').fill('E2E Test Task');
    await page.getByLabel('Description').fill('Created by Playwright test');
    await page.locator('#priority').selectOption('high');
    await page.getByRole('button', { name: /Create Task/ }).click();
    // Should navigate to tasks list
    await expect(page).toHaveURL('/tasks');
    // Task should appear in the list
    await expect(page.getByText('E2E Test Task')).toBeVisible();
  });

  test('cancel button returns to tasks list', async ({ page }) => {
    await page.goto('/tasks/new');
    await page.getByRole('link', { name: 'Cancel' }).click();
    await expect(page).toHaveURL('/tasks');
  });
});

test.describe('Task Form - Edit', () => {
  test('loads existing task data', async ({ page }) => {
    await page.goto('/tasks/1/edit');
    await expect(page.locator('h1')).toHaveText('Edit Task');
    const titleInput = page.getByLabel('Title');
    await expect(titleInput).not.toHaveValue('');
  });

  test('updates a task successfully', async ({ page }) => {
    // First create a task to edit
    await page.goto('/tasks/new');
    await page.getByLabel('Title').fill('Task To Edit');
    await page.getByRole('button', { name: /Create Task/ }).click();
    await expect(page).toHaveURL('/tasks');

    // Click on the task to edit
    await page.getByText('Task To Edit').first().click();
    await expect(page.locator('h1')).toHaveText('Edit Task');

    // Update the title
    await page.getByLabel('Title').fill('Updated Task Title');
    await page.getByRole('button', { name: /Save Changes/ }).click();
    await expect(page).toHaveURL('/tasks');
    await expect(page.getByText('Updated Task Title')).toBeVisible();
  });
});
