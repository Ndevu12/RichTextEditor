import type {
  NormalizedToolbarButtonItem,
  NormalizedToolbarItem,
  ToolbarButtonConfig,
  ToolbarResolverContext,
  ToolbarValueResolver,
} from '@/types';
import { BUILTIN_TOOLBAR_REGISTRY } from '../../constants/builtins';
import { getBuiltinAction } from '../../helpers/actions';
import { isBuiltinItemActive } from '../../helpers/activeState';
import type { ToolbarResolveContext } from '@/core/toolbar/types';

function resolveValue<T>(
  value: ToolbarValueResolver<T> | undefined,
  context: ToolbarResolverContext,
): T | undefined {
  if (typeof value === 'function') {
    return (value as (ctx: ToolbarResolverContext) => T)(context);
  }
  return value;
}

function compactToolbarSeparators(
  items: (ToolbarButtonConfig | '|')[],
): (ToolbarButtonConfig | '|')[] {
  const compacted: (ToolbarButtonConfig | '|')[] = [];

  for (const item of items) {
    if (item === '|' && (compacted.length === 0 || compacted[compacted.length - 1] === '|')) {
      continue;
    }
    compacted.push(item);
  }

  while (compacted[0] === '|') compacted.shift();
  while (compacted[compacted.length - 1] === '|') compacted.pop();

  return compacted;
}

function resolveToolbarButton(
  item: NormalizedToolbarButtonItem,
  context: ToolbarResolveContext,
): ToolbarButtonConfig | null {
  if (!item.builtinId) return null;

  const registryItem = BUILTIN_TOOLBAR_REGISTRY[item.builtinId];
  const resolverContext: ToolbarResolverContext = {
    id: item.id,
    readOnly: context.readOnly,
    activeMarks: context.activeMarks,
    activeNodes: context.activeNodes,
    headingLevel: context.headingLevel,
  };

  const isVisible =
    resolveValue(item.isVisible, resolverContext) ??
    resolveValue(registryItem.isVisible, resolverContext) ??
    true;

  if (!isVisible) return null;

  let fallbackDisabled = context.readOnly || !context.editor;
  if (!fallbackDisabled && context.editor) {
    if (item.builtinId === 'undo') fallbackDisabled = !context.editor.can().undo();
    if (item.builtinId === 'redo') fallbackDisabled = !context.editor.can().redo();
  }

  const isDisabled =
    resolveValue(item.isDisabled, resolverContext) ??
    resolveValue(registryItem.isDisabled, resolverContext) ??
    fallbackDisabled;

  const fallbackActive = isBuiltinItemActive(
    item.builtinId,
    context.activeMarks,
    context.activeNodes,
    context.headingLevel,
  );

  const isActive =
    resolveValue(item.isActive, resolverContext) ??
    resolveValue(registryItem.isActive, resolverContext) ??
    fallbackActive;

  const label =
    resolveValue(item.label, resolverContext) ?? resolveValue(registryItem.label, resolverContext);
  if (!label) return null;

  const shortcut =
    resolveValue(item.shortcut, resolverContext) ??
    resolveValue(registryItem.shortcut, resolverContext);
  const icon =
    resolveValue(item.icon, resolverContext) ??
    resolveValue(registryItem.icon, resolverContext) ??
    null;

  const onClick = item.onClick ?? registryItem.onClick;
  const action = onClick
    ? () => onClick(context)
    : context.editor
      ? getBuiltinAction(item.builtinId, context.editor)
      : () => {};

  return {
    id: item.builtinId,
    label,
    icon,
    action,
    isActive,
    isDisabled,
    shortcut,
  };
}

export function resolveToolbarItems(
  normalizedItems: NormalizedToolbarItem[],
  context: ToolbarResolveContext,
): (ToolbarButtonConfig | '|')[] {
  const resolved = normalizedItems.flatMap((item): (ToolbarButtonConfig | '|')[] => {
    if (item.type === 'separator') return ['|'];
    const button = resolveToolbarButton(item, context);
    return button ? [button] : [];
  });

  return compactToolbarSeparators(resolved);
}
