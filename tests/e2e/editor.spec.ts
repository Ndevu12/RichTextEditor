import { test, expect, type Page } from '@playwright/test';

const EDITOR_SELECTOR = '.rte-content .tiptap';

async function clearEditorAndType(page: Page, text: string) {
  const editor = page.locator(EDITOR_SELECTOR);
  await editor.click();
  await page.keyboard.press('Meta+A');
  await page.keyboard.press('Backspace');
  if (text) await page.keyboard.type(text, { delay: 20 });
}

async function getHTMLOutput(page: Page): Promise<string> {
  // Target the HTML output panel <pre>, not any <pre> inside the editor
  return page
    .locator('section')
    .filter({ hasText: 'HTML Output' })
    .locator('pre')
    .innerText();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.locator(EDITOR_SELECTOR).waitFor({ state: 'visible' });
});

test.describe('Editor — Core Editing', () => {
  test('type and format text with bold', async ({ page }) => {
    await clearEditorAndType(page, 'Hello World');

    // Select "World" using JavaScript for cross-browser reliability
    await page.locator(EDITOR_SELECTOR).evaluate((el) => {
      const textNode = el.querySelector('p')?.firstChild;
      if (!textNode) return;
      const range = document.createRange();
      range.setStart(textNode, 6); // after "Hello "
      range.setEnd(textNode, 11); // end of "World"
      const sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);
    });

    // Click Bold button
    await page.locator('button[data-toolbar-item="bold"]').click();

    const output = await getHTMLOutput(page);
    expect(output).toContain('<strong>World</strong>');
  });

  test('apply heading via toolbar', async ({ page }) => {
    await clearEditorAndType(page, 'My Heading');

    // Select all text
    await page.keyboard.press('Meta+A');

    // Click H1 button
    await page.locator('button[data-toolbar-item="heading1"]').click();

    const output = await getHTMLOutput(page);
    expect(output).toContain('<h1>');
    expect(output).toContain('My Heading');
  });

  test('insert link via dialog', async ({ page }) => {
    await clearEditorAndType(page, 'Visit our site');

    // Select "our site" using JavaScript for cross-browser reliability
    await page.locator(EDITOR_SELECTOR).evaluate((el) => {
      const textNode = el.querySelector('p')?.firstChild;
      if (!textNode) return;
      const range = document.createRange();
      range.setStart(textNode, 6); // after "Visit "
      range.setEnd(textNode, 14); // end of "our site"
      const sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);
    });

    // Open link dialog
    await page.locator('button[data-toolbar-item="link"]').click();

    // Wait for and fill the link dialog
    const dialog = page.locator('[role="dialog"]');
    await dialog.waitFor({ state: 'visible' });

    await page.locator('#rte-link-url').fill('https://example.com');
    await page.locator('.rte-dialog__button--primary').click();

    const output = await getHTMLOutput(page);
    expect(output).toContain('<a');
    expect(output).toContain('https://example.com');
  });

  test('insert image via dialog', async ({ page }) => {
    await clearEditorAndType(page, '');

    // Open image dialog
    await page.locator('button[data-toolbar-item="image"]').click();

    const dialog = page.locator('[role="dialog"]');
    await dialog.waitFor({ state: 'visible' });

    // Enter image URL
    await page.locator('#rte-image-url').fill('https://example.com/photo.jpg');
    await page.locator('.rte-dialog__button--primary').click();

    const output = await getHTMLOutput(page);
    expect(output).toContain('<img');
    expect(output).toContain('https://example.com/photo.jpg');
  });

  test('create bullet list', async ({ page }) => {
    await clearEditorAndType(page, 'Item one');

    // Click bullet list button
    await page.locator('button[data-toolbar-item="bulletList"]').click();

    const output = await getHTMLOutput(page);
    expect(output).toContain('<ul>');
    expect(output).toContain('<li>');
  });

  test('create code block via toolbar', async ({ page }) => {
    // Clear editor, then toggle code block mode before typing
    await clearEditorAndType(page, '');
    await page.locator('button[data-toolbar-item="codeBlock"]').click();

    // Focus editor and type code
    await page.locator(EDITOR_SELECTOR).click();
    await page.keyboard.type('const x = 1;', { delay: 20 });

    const output = await getHTMLOutput(page);
    expect(output).toContain('<pre>');
    expect(output).toContain('<code');
  });

  test('undo and redo', async ({ page }) => {
    await clearEditorAndType(page, 'Hello');

    // Select all and bold
    await page.keyboard.press('Meta+A');
    await page.locator('button[data-toolbar-item="bold"]').click();

    let output = await getHTMLOutput(page);
    expect(output).toContain('<strong>');

    // Undo
    await page.locator('button[data-toolbar-item="undo"]').click();
    output = await getHTMLOutput(page);
    expect(output).not.toContain('<strong>');

    // Redo
    await page.locator('button[data-toolbar-item="redo"]').click();
    output = await getHTMLOutput(page);
    expect(output).toContain('<strong>');
  });

  test('placeholder is visible in empty editor and disappears on type', async ({ page }) => {
    await clearEditorAndType(page, '');

    // The wrapper has data-placeholder attribute
    const contentWrapper = page.locator('.rte-content');
    await expect(contentWrapper).toHaveAttribute('data-placeholder', 'Start writing...');

    // The editor should show placeholder via either an is-editor-empty class
    // or an aria-placeholder attribute on the tiptap container
    const editor = page.locator(EDITOR_SELECTOR);
    const ariaPlaceholder = await editor.getAttribute('aria-placeholder');
    expect(ariaPlaceholder).toBe('Start writing...');

    // Verify the editor is empty (content should be minimal)
    const htmlOutput = await getHTMLOutput(page);
    const stripped = htmlOutput.replace(/<[^>]*>/g, '').trim();
    expect(stripped).toBe('');

    // Type something — content should appear in output
    await page.keyboard.type('Some text', { delay: 20 });
    const newOutput = await getHTMLOutput(page);
    expect(newOutput).toContain('Some text');
  });

  test('read-only mode prevents editing', async ({ page }) => {
    // Enable read-only mode via the playground checkbox
    await page.locator('text=Read-only').click();

    // The editor wrapper should have data-readonly attribute
    await expect(page.locator('.rte-editor[data-readonly]')).toBeVisible();

    // The toolbar should be hidden
    await expect(page.locator('.rte-toolbar')).not.toBeVisible();

    // The contenteditable attribute should be false
    const editable = await page.locator(EDITOR_SELECTOR).getAttribute('contenteditable');
    expect(editable).toBe('false');
  });
});
