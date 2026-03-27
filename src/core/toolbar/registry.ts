import { BUILTIN_TOOLBAR_REGISTRY, isToolbarItemType } from '@/constants/builtins';
import { getBuiltinAction } from '@/helpers/actions';
import { isBuiltinItemActive } from '@/helpers/activeState';

/**
 * Core registry facade for toolbar built-ins.
 * Keeps hook-level code decoupled from where concrete implementations live.
 */
export const toolbarRegistry = {
  items: BUILTIN_TOOLBAR_REGISTRY,
  isBuiltinId: isToolbarItemType,
  getAction: getBuiltinAction,
  getActiveState: isBuiltinItemActive,
} as const;
