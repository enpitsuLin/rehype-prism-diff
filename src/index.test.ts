import { describe, test, expect } from 'vitest';
import { rehype } from 'rehype';
import dedent from 'dedent';
import rehypePrismDiff from '.';
import rehypePrism, { RehypePrismOptions } from 'rehype-prism';
import { visit } from 'unist-util-visit';
import type { Element } from 'hast';

const addMeta = (meta?: string) => {
  if (!meta) return;
  return (tree: Element) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'code') {
        node.data = { meta: meta };
      }
    });
  };
};

describe('rehypre-prism plugin', () => {
  const processHtml = (html: string, setting?: { options?: RehypePrismOptions; meta?: string }) => {
    return rehype()
      .data('settings', { fragment: true })
      .use(addMeta, setting?.meta || '')
      .use(rehypePrism, setting?.options)
      .use(rehypePrismDiff)
      .processSync(html)
      .toString();
  };
  test('should add diff', () => {
    const meta = 'diff';
    const result = processHtml(
      dedent`
    <div>
      <pre>
      <code class="language-css">p { color: red }</code>
      </pre>
    </div>
    `,
      {
        meta
      }
    );
    expect(result).toMatchSnapshot();
  });
});
