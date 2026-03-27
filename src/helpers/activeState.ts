import type { ToolbarItemType } from '@/types';

export function isBuiltinItemActive(
  id: ToolbarItemType,
  activeMarks: Set<string>,
  activeNodes: Set<string>,
  headingLevel: number | null,
): boolean {
  switch (id) {
    case 'bold':
    case 'italic':
    case 'underline':
    case 'strike':
    case 'code':
    case 'link':
      return activeMarks.has(id);
    case 'heading1':
      return headingLevel === 1;
    case 'heading2':
      return headingLevel === 2;
    case 'heading3':
      return headingLevel === 3;
    case 'heading4':
      return headingLevel === 4;
    case 'heading5':
      return headingLevel === 5;
    case 'heading6':
      return headingLevel === 6;
    case 'bulletList':
    case 'orderedList':
    case 'blockquote':
    case 'codeBlock':
      return activeNodes.has(id);
    default:
      return false;
  }
}
