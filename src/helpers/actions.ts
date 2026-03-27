import type { Editor } from '@tiptap/core';
import {
  toggleBold,
  toggleItalic,
  toggleUnderline,
  toggleStrike,
  setHeading,
  toggleBulletList,
  toggleOrderedList,
  toggleBlockquote,
  toggleCode,
  toggleCodeBlock,
  undo as undoCmd,
  redo as redoCmd,
} from '@/core/commands';
import { useEditorStore } from '@/core/store';
import type { ToolbarItemType } from '@/types';

export function getBuiltinAction(id: ToolbarItemType, editor: Editor): () => void {
  switch (id) {
    case 'bold':
      return () => toggleBold(editor);
    case 'italic':
      return () => toggleItalic(editor);
    case 'underline':
      return () => toggleUnderline(editor);
    case 'strike':
      return () => toggleStrike(editor);
    case 'heading1':
      return () => setHeading(editor, 1);
    case 'heading2':
      return () => setHeading(editor, 2);
    case 'heading3':
      return () => setHeading(editor, 3);
    case 'heading4':
      return () => setHeading(editor, 4);
    case 'heading5':
      return () => setHeading(editor, 5);
    case 'heading6':
      return () => setHeading(editor, 6);
    case 'bulletList':
      return () => toggleBulletList(editor);
    case 'orderedList':
      return () => toggleOrderedList(editor);
    case 'blockquote':
      return () => toggleBlockquote(editor);
    case 'code':
      return () => toggleCode(editor);
    case 'codeBlock':
      return () => toggleCodeBlock(editor);
    case 'link':
      return () => useEditorStore.getState().setOpenDialog('link');
    case 'image':
      return () => useEditorStore.getState().setOpenDialog('image');
    case 'undo':
      return () => undoCmd(editor);
    case 'redo':
      return () => redoCmd(editor);
  }
}
