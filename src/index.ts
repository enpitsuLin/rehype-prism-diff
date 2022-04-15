import { visit } from 'unist-util-visit';
import { classList } from './classlist';
import type { Element, ElementContent } from 'hast';

const classMap = { '+': 'add', '-': 'del', '!': 'warn', '#': 'comment' };

function dfs(node: ElementContent) {
  if ('children' in node) {
    return node.children
      .map(dfs)
      .flat()
      .find((i) => !!i);
  }

  if ('value' in node && node.value != '')
    if (/^[-+!#]/.test(node.value)) {
      return node;
    }
}

export default function rehypePrismDiff() {
  return (tree: Element) => {
    visit(tree, 'element', (node: Element, index: number, parent: Element) => {
      if (!parent || parent.tagName !== 'pre' || node.tagName !== 'code') {
        return;
      }
      let meta: string = node.data && <string>node.data.meta ? <string>node.data.meta : '';
      if (!meta.toLowerCase().includes('diff'.toLowerCase())) return;

      classList(node).add('code-diff');
      node.children.forEach((line) => {
        if (line.type !== 'element') return;
        let operatorNode = dfs(line);
        if (operatorNode) {
          const operator = operatorNode.value.match(/^[-+!#]/)?.[0];

          line.properties.operator = operator;
          operatorNode.value = operatorNode.value.slice(1);
          classList(line).add(`diff-${classMap[operator]}`);
        }
      });
    });
  };
}
