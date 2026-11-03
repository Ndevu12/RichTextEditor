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

describe('toolbar layout in a narrow container', () => {
  it('lets groups wrap and shrink to the editor width', () => {
    const toolbar = block(toolbarCss, '.rte-toolbar {');
    const group = block(toolbarCss, '.rte-toolbar__group {');
    const label = block(toolbarCss, '.rte-toolbar__button--label {');

    expect(toolbar).toContain('flex-wrap: wrap');
    expect(toolbar).toContain('min-width: 0');
    expect(toolbar).toContain('max-width: 100%');
    expect(group).toContain('flex-wrap: wrap');
    expect(group).toContain('min-width: 0');
    expect(group).toContain('max-width: 100%');
    expect(label).toContain('max-width: 100%');
    expect(label).toContain('text-overflow: ellipsis');
  });

  it('wraps the toolbar row so the preview toggle can drop below', () => {
    const row = block(previewCss, '.rte-toolbar-row {');
    const toolbar = block(previewCss, '.rte-toolbar-row .rte-toolbar {');

    expect(row).toContain('flex-wrap: wrap');
    expect(row).toContain('min-width: 0');
    expect(toolbar).toContain('min-width: 0');
  });
});
