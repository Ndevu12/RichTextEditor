import { test, expect } from '@playwright/test';

const EDITOR_SELECTOR = '.rte-content .tiptap';
const EDITOR_WRAPPER = '.rte-editor';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.locator(EDITOR_SELECTOR).waitFor({ state: 'visible' });
});

test.describe('Themes — Visual & Attribute Switching', () => {
  test('light theme is applied by default', async ({ page }) => {
    const wrapper = page.locator(EDITOR_WRAPPER);
    await expect(wrapper).toHaveAttribute('data-theme', 'light');

    const bgColor = await wrapper.evaluate((el) =>
      getComputedStyle(el).getPropertyValue('--rte-bg').trim(),
    );
    expect(bgColor).toBe('#ffffff');
  });

  test('dark theme is applied after toggle', async ({ page }) => {
    // Click the theme toggle button (contains "Dark" text in light mode)
    await page.getByRole('button', { name: /Dark/i }).click();

    const wrapper = page.locator(EDITOR_WRAPPER);
    await expect(wrapper).toHaveAttribute('data-theme', 'dark');

    const bgColor = await wrapper.evaluate((el) =>
      getComputedStyle(el).getPropertyValue('--rte-bg').trim(),
    );
    expect(bgColor).toBe('#1e1e2e');
  });

  test('theme switches dynamically between light and dark', async ({ page }) => {
    const wrapper = page.locator(EDITOR_WRAPPER);

    // Start in light
    await expect(wrapper).toHaveAttribute('data-theme', 'light');

    // Switch to dark
    await page.getByRole('button', { name: /Dark/i }).click();
    await expect(wrapper).toHaveAttribute('data-theme', 'dark');

    const darkBg = await wrapper.evaluate((el) =>
      getComputedStyle(el).getPropertyValue('--rte-bg').trim(),
    );
    expect(darkBg).toBe('#1e1e2e');

    // Switch back to light
    await page.getByRole('button', { name: /Light/i }).click();
    await expect(wrapper).toHaveAttribute('data-theme', 'light');

    const lightBg = await wrapper.evaluate((el) =>
      getComputedStyle(el).getPropertyValue('--rte-bg').trim(),
    );
    expect(lightBg).toBe('#ffffff');
  });
});
