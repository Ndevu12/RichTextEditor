import TurndownService from 'turndown';

let service: TurndownService | null = null;

function getService(): TurndownService {
  if (!service) {
    service = new TurndownService({
      headingStyle: 'atx',
      hr: '---',
      bulletListMarker: '-',
      codeBlockStyle: 'fenced',
      fence: '```',
      emDelimiter: '*',
      strongDelimiter: '**',
      linkStyle: 'inlined',
    });

    service.addRule('strikethrough', {
      filter: (node) => {
        const tag = node.nodeName.toLowerCase();
        return tag === 'del' || tag === 's' || tag === 'strike';
      },
      replacement: (content) => `~~${content}~~`,
    });

    service.addRule('underline', {
      filter: ['u'],
      replacement: (content) => `<u>${content}</u>`,
    });
  }

  return service;
}

/**
 * Convert an HTML string to Markdown.
 */
export function toMarkdown(html: string): string {
  if (!html || html === '<p></p>') return '';
  return getService().turndown(html);
}
