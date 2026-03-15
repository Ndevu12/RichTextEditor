import type { Theme } from 'rich-text-editor-ndevu';

interface HeaderProps {
  theme: Theme;
  showPreview: boolean;
  onToggleTheme: () => void;
  onTogglePreview: () => void;
  onSave: () => void;
}

export function Header({
  theme,
  showPreview,
  onToggleTheme,
  onTogglePreview,
  onSave,
}: HeaderProps) {
  const isDark = theme === 'dark';

  return (
    <header className="header">
      <h1 className="header__title">📝 Blog Post Editor</h1>

      <div className="header__actions">
        <button className="btn" onClick={onToggleTheme}>
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </button>
        <button className="btn" onClick={onTogglePreview}>
          {showPreview ? '✏️ Edit' : '👁 Preview'}
        </button>
        <button className="btn btn--primary" onClick={onSave}>
          💾 Save
        </button>
      </div>
    </header>
  );
}
