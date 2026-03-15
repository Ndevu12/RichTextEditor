/**
 * Inline SVG icons for toolbar buttons.
 *
 * Each icon is a lightweight React element (no external deps).
 * Sized at 18×18 by default; inherits `currentColor` from the button.
 */

import type { ReactElement } from 'react';
import type { ToolbarItemType } from '@/types';

const SIZE = 18;

/** Common SVG wrapper props */
const svgProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: SIZE,
  height: SIZE,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true as const,
};

// ── Icons ────────────────────────────────────────────────

const BoldIcon = (
  <svg {...svgProps}>
    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
  </svg>
);

const ItalicIcon = (
  <svg {...svgProps}>
    <line x1="19" y1="4" x2="10" y2="4" />
    <line x1="14" y1="20" x2="5" y2="20" />
    <line x1="15" y1="4" x2="9" y2="20" />
  </svg>
);

const UnderlineIcon = (
  <svg {...svgProps}>
    <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
    <line x1="4" y1="21" x2="20" y2="21" />
  </svg>
);

const StrikeIcon = (
  <svg {...svgProps}>
    <line x1="4" y1="12" x2="20" y2="12" />
    <path d="M16 4H9a3 3 0 0 0 0 6h6" />
    <path d="M8 20h7a3 3 0 0 0 0-6H9" />
  </svg>
);

const Heading1Icon = (
  <svg {...svgProps}>
    <path d="M4 12h8" />
    <path d="M4 18V6" />
    <path d="M12 18V6" />
    <path d="M17 12l3-2v10" />
  </svg>
);

const Heading2Icon = (
  <svg {...svgProps}>
    <path d="M4 12h8" />
    <path d="M4 18V6" />
    <path d="M12 18V6" />
    <path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1" />
  </svg>
);

const Heading3Icon = (
  <svg {...svgProps}>
    <path d="M4 12h8" />
    <path d="M4 18V6" />
    <path d="M12 18V6" />
    <path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2" />
    <path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2" />
  </svg>
);

const Heading4Icon = (
  <svg {...svgProps}>
    <path d="M4 12h8" />
    <path d="M4 18V6" />
    <path d="M12 18V6" />
    <path d="M17 10v4h4" />
    <path d="M21 10v8" />
  </svg>
);

const Heading5Icon = (
  <svg {...svgProps}>
    <path d="M4 12h8" />
    <path d="M4 18V6" />
    <path d="M12 18V6" />
    <path d="M17 18h2a2 2 0 0 0 2-2c0-1.7-1.5-2-2-2h-2v-4h4" />
  </svg>
);

const Heading6Icon = (
  <svg {...svgProps}>
    <path d="M4 12h8" />
    <path d="M4 18V6" />
    <path d="M12 18V6" />
    <circle cx="19" cy="16" r="2" />
    <path d="M20 10c-2 2-3 3.5-3 6" />
  </svg>
);

const BulletListIcon = (
  <svg {...svgProps}>
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" />
    <circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const OrderedListIcon = (
  <svg {...svgProps}>
    <line x1="10" y1="6" x2="21" y2="6" />
    <line x1="10" y1="12" x2="21" y2="12" />
    <line x1="10" y1="18" x2="21" y2="18" />
    <text
      x="4"
      y="8"
      fontSize="7"
      fontWeight="600"
      fill="currentColor"
      stroke="none"
      fontFamily="system-ui, sans-serif"
    >
      1
    </text>
    <text
      x="4"
      y="14"
      fontSize="7"
      fontWeight="600"
      fill="currentColor"
      stroke="none"
      fontFamily="system-ui, sans-serif"
    >
      2
    </text>
    <text
      x="4"
      y="20"
      fontSize="7"
      fontWeight="600"
      fill="currentColor"
      stroke="none"
      fontFamily="system-ui, sans-serif"
    >
      3
    </text>
  </svg>
);

const BlockquoteIcon = (
  <svg {...svgProps}>
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
  </svg>
);

const CodeIcon = (
  <svg {...svgProps}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const CodeBlockIcon = (
  <svg {...svgProps}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="10 10 8 12 10 14" />
    <polyline points="14 10 16 12 14 14" />
  </svg>
);

const LinkIcon = (
  <svg {...svgProps}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const ImageIcon = (
  <svg {...svgProps}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const UndoIcon = (
  <svg {...svgProps}>
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </svg>
);

const RedoIcon = (
  <svg {...svgProps}>
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

// ── Icon registry ────────────────────────────────────────

export const TOOLBAR_ICONS: Record<ToolbarItemType, ReactElement> = {
  bold: BoldIcon,
  italic: ItalicIcon,
  underline: UnderlineIcon,
  strike: StrikeIcon,
  heading1: Heading1Icon,
  heading2: Heading2Icon,
  heading3: Heading3Icon,
  heading4: Heading4Icon,
  heading5: Heading5Icon,
  heading6: Heading6Icon,
  bulletList: BulletListIcon,
  orderedList: OrderedListIcon,
  blockquote: BlockquoteIcon,
  code: CodeIcon,
  codeBlock: CodeBlockIcon,
  link: LinkIcon,
  image: ImageIcon,
  undo: UndoIcon,
  redo: RedoIcon,
};
