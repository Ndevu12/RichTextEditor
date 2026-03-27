import { normalizeToolbarInput } from '@/utils/toolbar/normalizeToolbarInput';
import { resolveToolbarItems } from '@/utils/toolbar/resolveToolbarItems';
import type { ToolbarInput, ToolbarButtonConfig, ToolbarResolveContext } from '@/types';

/**
 * Core toolbar normalization + resolution pipeline.
 */
export function resolveToolbarFromInput(
  toolbarInput: ToolbarInput,
  context: ToolbarResolveContext,
): (ToolbarButtonConfig | '|')[] {
  const normalized = normalizeToolbarInput(toolbarInput);
  return resolveToolbarItems(normalized, context);
}
