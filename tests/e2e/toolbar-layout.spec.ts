import { test, expect } from '@playwright/test';

const EDITOR_SELECTOR = '.rte-content .tiptap';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.locator(EDITOR_SELECTOR).waitFor({ state: 'visible' });
});

test.describe('Toolbar lines and preview switch', () => {
  test('keeps the preview switch in the page header', async ({ page }) => {
    const toggle = page.getByRole('radiogroup', { name: 'Preview mode' });
    await expect(toggle).toBeVisible();
    await expect(page.locator('header').getByRole('radiogroup', { name: 'Preview mode' })).toBeVisible();
    await expect(page.locator('.rte-toolbar').getByRole('radiogroup', { name: 'Preview mode' })).toHaveCount(0);
    await expect(page.locator('.rte-editor').getByRole('radiogroup', { name: 'Preview mode' })).toHaveCount(0);
  });

  test('opens HTML and Markdown beside the text, then returns to the editor', async ({ page }) => {
    await page.getByRole('radio', { name: 'HTML' }).click();
    const html = page.getByRole('region', { name: 'HTML preview' });
    await expect(html).toBeVisible();
    await expect(html).toContainText('Welcome to the Playground');

    await page.getByRole('radio', { name: 'MD' }).click();
    const markdown = page.getByRole('region', { name: 'Markdown preview' });
    await expect(markdown).toBeVisible();
    await expect(markdown).toContainText('Welcome to the Playground');
    await expect(html).toHaveCount(0);

    await page.getByRole('radio', { name: 'Editor' }).click();
    await expect(page.getByRole('region', { name: 'Markdown preview' })).toHaveCount(0);
    await expect(page.locator(EDITOR_SELECTOR)).toBeVisible();
  });

  test('uses one tool row on a wide card and two set lines on a narrow card', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await expect(page.locator('.rte-toolbar')).toHaveCSS('flex-direction', 'row');

    await page.setViewportSize({ width: 480, height: 900 });
    await expect(page.locator('.rte-toolbar')).toHaveCSS('flex-direction', 'column');

    const lines = page.locator('.rte-toolbar__line');
    await expect(lines).toHaveCount(2);
    await expect(lines.nth(0).locator('[data-toolbar-item="bold"]')).toBeVisible();
    await expect(lines.nth(0).locator('[data-toolbar-item="blockquote"]')).toBeVisible();
    await expect(lines.nth(0).locator('[data-toolbar-item="code"]')).toHaveCount(0);
    await expect(lines.nth(1).locator('[data-toolbar-item="code"]')).toBeVisible();
    await expect(lines.nth(1).locator('[data-toolbar-item="image"]')).toBeVisible();
    await expect(lines.nth(1).locator('[data-toolbar-item="redo"]')).toBeVisible();

    const overflow = await page.locator('.rte-toolbar').evaluate((toolbar) => {
      const box = toolbar.getBoundingClientRect();
      return toolbar.scrollWidth > Math.ceil(box.width) + 1;
    });
    expect(overflow).toBe(false);
  });
});
