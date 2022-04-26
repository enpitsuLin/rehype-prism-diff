//@ts-ignore
import ClassList from 'hast-util-class-list'
import { visit } from 'unist-util-visit'
import { toString } from 'hast-util-to-string'
import type { Plugin } from 'unified'
import type { Element, ElementContent } from 'hast'

export interface Options {}

function classList(node: Element) {
  //@ts-ignore
  return ClassList(node)
}

const rehypePrismDiff: Plugin<[Options?], Element> = (option) => {
  return (tree: Element) => {
    visit(tree, 'element', (node, _index, parent) => {
      if (!parent || parent.tagName !== 'pre' || !('tagName' in node) || node.tagName !== 'code') {
        return
      }
      let meta: string = node.data && <string>node.data.meta ? <string>node.data.meta : ''
      if (!meta.toLowerCase().includes('diff'.toLowerCase())) return

      classList(node).add('code-diff')
      node.children.forEach((line: ElementContent) => {
        if (line.type !== 'element') return
        const lineString = toString(line)
        if (lineString.substring(0, 1) === '-') {
          classList(line).add(`diff-deleted`)
        } else if (lineString.substring(0, 1) === '+') {
          classList(line).add(`diff-inserted`)
        } else if (lineString.substring(0, 1) === '!') {
          classList(line).add(`diff-warn`)
        } else if (lineString.substring(0, 1) === '#') {
          classList(line).add(`diff-comment`)
        }
      })
    })
  }
}
export default rehypePrismDiff
