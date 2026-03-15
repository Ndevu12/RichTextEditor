import type { Theme } from 'rich-text-editor-ndevu';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  const isDark = theme === 'dark';

  return (
    <header className="header">
      <h1 className="header__title">📝 Next.js Editor Demo</h1>
      <div className="header__actions">
        <button className="btn" onClick={onToggleTheme}>
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
    </header>
  );
}
