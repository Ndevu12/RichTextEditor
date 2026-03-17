import { test, expect } from '@playwright/test';

const EDITOR_SELECTOR = '.rte-content .tiptap';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.locator(EDITOR_SELECTOR).waitFor({ state: 'visible' });
});

test.describe('Toolbar — Button States & Interaction', () => {
  test('bold button shows pressed state when bold text is selected', async ({ page }) => {
    const editor = page.locator(EDITOR_SELECTOR);
    await editor.click();

    // Clear and type text
    await page.keyboard.press('Meta+A');
    await page.keyboard.press('Backspace');
    await page.keyboard.type('Bold text', { delay: 20 });

    // Select all and apply bold
    await page.keyboard.press('Meta+A');
    const boldBtn = page.locator('button[data-toolbar-item="bold"]');
    await boldBtn.click();

    // Re-focus and re-select so button state updates
    await editor.click();
    await page.keyboard.press('Meta+A');

    await expect(boldBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(boldBtn).toHaveAttribute('data-active', 'true');
  });

  test('minimal toolbar preset shows only expected buttons', async ({ page }) => {
    // Switch to minimal preset via the dropdown
    await page.locator('#preset-select').selectOption('minimal');

    // Minimal preset: bold, italic, underline, |, link
    const boldBtn = page.locator('button[data-toolbar-item="bold"]');
    const italicBtn = page.locator('button[data-toolbar-item="italic"]');
    const underlineBtn = page.locator('button[data-toolbar-item="underline"]');
    const linkBtn = page.locator('button[data-toolbar-item="link"]');

    await expect(boldBtn).toBeVisible();
    await expect(italicBtn).toBeVisible();
    await expect(underlineBtn).toBeVisible();
    await expect(linkBtn).toBeVisible();

    // Buttons NOT in minimal preset should be absent
    const heading1Btn = page.locator('button[data-toolbar-item="heading1"]');
    const imageBtn = page.locator('button[data-toolbar-item="image"]');
    const codeBlockBtn = page.locator('button[data-toolbar-item="codeBlock"]');

    await expect(heading1Btn).not.toBeVisible();
    await expect(imageBtn).not.toBeVisible();
    await expect(codeBlockBtn).not.toBeVisible();
  });

  test('keyboard shortcut Ctrl+B toggles bold', async ({ page }) => {
    const editor = page.locator(EDITOR_SELECTOR);
    await editor.click();

    await page.keyboard.press('Meta+A');
    await page.keyboard.press('Backspace');
    await page.keyboard.type('Shortcut test', { delay: 20 });

    // Select all
    await page.keyboard.press('Meta+A');

    // Toggle bold with keyboard shortcut
    await page.keyboard.press('Meta+B');

    const output = await page.locator('pre').first().innerText();
    expect(output).toContain('<strong>');

    // Bold button should reflect pressed state
    const boldBtn = page.locator('button[data-toolbar-item="bold"]');
    await expect(boldBtn).toHaveAttribute('aria-pressed', 'true');

    // Toggle off
    await page.keyboard.press('Meta+B');
    const output2 = await page.locator('pre').first().innerText();
    expect(output2).not.toContain('<strong>');
  });
});
