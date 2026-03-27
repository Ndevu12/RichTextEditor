import type { ToolbarInput, NormalizedToolbarItem } from '@/types';
import { isToolbarItemType } from '@/constants/builtins';

export function normalizeToolbarInput(toolbarItems: ToolbarInput): NormalizedToolbarItem[] {
  return toolbarItems.flatMap((item, index): NormalizedToolbarItem[] => {
    if (item === '|') {
      return [{ type: 'separator', id: `separator-${index}` }];
    }

    if (typeof item === 'string') {
      return isToolbarItemType(item) ? [{ type: 'button', id: item, builtinId: item }] : [];
    }

    if (item.type === 'separator') {
      return [{ type: 'separator', id: item.id ?? `separator-${index}` }];
    }

    const builtinId =
      typeof item.id === 'string' && isToolbarItemType(item.id) ? item.id : undefined;
    return [
      {
        type: 'button',
        id: item.id,
        builtinId,
        label: item.label,
        icon: item.icon,
        shortcut: item.shortcut,
        isVisible: item.isVisible,
        isDisabled: item.isDisabled,
        isActive: item.isActive,
        onClick: item.onClick,
      },
    ];
  });
}
