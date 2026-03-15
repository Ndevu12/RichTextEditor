interface HtmlOutputProps {
  html: string;
}

export function HtmlOutput({ html }: HtmlOutputProps) {
  return (
    <details className="html-output">
      <summary className="html-output__summary">Raw HTML</summary>
      <pre className="html-output__code">{html}</pre>
    </details>
  );
}
