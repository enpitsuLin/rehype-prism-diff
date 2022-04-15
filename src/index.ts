import { visit } from 'unist-util-visit';
import type { Element, ElementContent, Comment, Text } from 'hast';

const classMap = { '+': 'inserted', '-': 'deleted', '!': 'warn', '#': 'comment' };

function classList(node: Element) {
  if (node.properties?.className) {
    if (typeof node.properties?.className === 'boolean') {
      node.properties.className = [];
    } else if (!Array.isArray(node.properties?.className)) {
      node.properties.className = [node.properties.className];
    }
  } else {
    if (node.properties) node.properties.className = [];
    else node.properties = { className: [] };
  }
  let tokens = (node.properties?.className as string[]) || [];
  let attribute = tokens.join(' ');
  let classList = {
    add: add,
    remove: remove,
    contains: contains,
    toggle: toggle,
    replace: replace,
    item: item,
    length: tokens.length,
    toString: function () {
      return attribute;
    }
  };

  function add(token: string) {
    if (tokens.indexOf(token) > -1) return;
    tokens.push(token);
    update();
  }

  function remove(token: string) {
    let index = tokens.indexOf(token);
    if (index === -1) return;
    tokens.splice(index, 1);
    update();
  }

  function contains(token: string) {
    return tokens.includes(token);
  }

  function toggle(token: any) {
    if (contains(token)) {
      remove(token);
      return false;
    } else {
      add(token);
      return true;
    }
  }

  function replace(a: string, b: string) {
    let i = tokens.indexOf(a);
    if (i > -1) tokens[i] = b;
  }

  function item(index: number) {
    return tokens[index] || null;
  }

  function update() {
    classList.length = tokens.length;
    attribute = tokens.join(' ');
  }

  return classList;
}

function dfs(node: ElementContent): undefined | Comment | Text {
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
    visit(tree, 'element', (node, _index, parent) => {
      if (!parent || parent.tagName !== 'pre' || !('tagName' in node) || node.tagName !== 'code') {
        return;
      }
      let meta: string = node.data && <string>node.data.meta ? <string>node.data.meta : '';
      if (!meta.toLowerCase().includes('diff'.toLowerCase())) return;

      classList(node).add('code-diff');
      node.children.forEach((line: ElementContent) => {
        if (line.type !== 'element') return;
        let operatorNode = dfs(line);
        if (operatorNode) {
          const operator = operatorNode.value.match(/^[-+!#]/)?.[0] as '+' | '-' | '!' | '#';
          if (operator) {
            line.properties = { operator };
            operatorNode.value = operatorNode.value.slice(1);
            classList(line).add(`diff-${classMap[operator]}`);
          }
        }
      });
    });
  };
}
