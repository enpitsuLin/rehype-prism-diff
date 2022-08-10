import { visit } from 'unist-util-visit'
import { toString } from 'hast-util-to-string'
import { fromString } from 'hast-util-from-string'
import type { Plugin } from 'unified'
import type { Element, ElementContent } from 'hast'

export interface Options {
  /** remove the first character which used to mark */
  remove?: boolean
}

function addClass(node: Element, className: string) {
  if (!node.properties) return
  if (!node.properties.className) node.properties.className = [className]
  ;(node.properties.className as string[]).push(className)
}

const rehypePrismDiff: Plugin<[Options?], Element> = (option = { remove: false }) => {
  return (tree: Element) => {
    visit(tree, 'element', (node, _index, parent) => {
      if (!parent || parent.tagName !== 'pre' || !('tagName' in node) || node.tagName !== 'code') {
        return
      }
      let meta: string = node.data && <string>node.data.meta ? <string>node.data.meta : ''
      if (!meta.toLowerCase().includes('diff'.toLowerCase())) return

      addClass(node, 'code-diff')
      node.children.forEach((line: ElementContent) => {
        if (line.type !== 'element') return
        const lineString = toString(line)
        if (lineString.substring(0, 1) === '-') {
          addClass(line, `diff-deleted`)
        } else if (lineString.substring(0, 1) === '+') {
          addClass(line, `diff-inserted`)
        } else if (lineString.substring(0, 1) === '!') {
          addClass(line, `diff-warn`)
        } else if (lineString.substring(0, 1) === '#') {
          addClass(line, `diff-comment`)
        }
        if (option?.remove) {
          removeFirstChar(line)
        }
      })
    })
  }

  function removeFirstChar(line: Element) {
    line.children.forEach((item) => {
      if (item.type !== 'text') return
      const itemString = toString(item)
      if (itemString.match(/\+|-|!|#/)) fromString(line, itemString.substring(1))
    })
  }
}
export default rehypePrismDiff
