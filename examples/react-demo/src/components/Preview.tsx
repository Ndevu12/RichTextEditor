interface PreviewProps {
  title: string;
  body: string;
}

export function Preview({ title, body }: PreviewProps) {
  return (
    <article className="preview">
      <h1 className="preview__title">{title || 'Untitled'}</h1>
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </article>
  );
}
