import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const toolbarCss = readFileSync(resolve('src/styles/toolbar.css'), 'utf8');
const previewCss = readFileSync(resolve('src/styles/preview.css'), 'utf8');

function block(css: string, selector: string): string {
  const start = css.indexOf(selector);
  expect(start).toBeGreaterThanOrEqual(0);
  const open = css.indexOf('{', start);
  const close = css.indexOf('}', open);
  return css.slice(open, close);
}

describe('toolbar scales with its container', () => {
  it('sizes buttons, icons, and gaps from the toolbar width', () => {
    const toolbar = block(toolbarCss, '.rte-toolbar {');
    const group = block(toolbarCss, '.rte-toolbar__group {');
    const button = block(toolbarCss, '.rte-toolbar__button {');
    const icon = block(toolbarCss, '.rte-toolbar__button svg {');

    expect(toolbar).toContain('container-type: inline-size');
    expect(toolbar).toContain('flex-wrap: nowrap');
    expect(toolbar).not.toContain('flex-wrap: wrap');
    expect(toolbar).toContain('cqw');
    expect(group).toContain('flex-wrap: nowrap');
    expect(group).toContain('min-width: 0');
    expect(button).toContain('min-width: 0');
    expect(button).toContain('aspect-ratio: 1');
    expect(toolbar).toContain('--rte-toolbar-icon-size: 62%');
    expect(icon).toContain('var(--rte-toolbar-icon-size)');
  });

  it('stacks the two tool lines only inside a narrow editor', () => {
    const row = block(previewCss, '.rte-toolbar-row {');

    expect(row).toContain('container-type: inline-size');
    expect(row).toContain('container-name: rte-toolbar-row');
    expect(toolbarCss).toContain('.rte-toolbar__line');
    expect(toolbarCss).toContain('@container rte-toolbar-row (max-width: 42rem)');
    expect(toolbarCss).toContain('flex-direction: column');
  });
});
