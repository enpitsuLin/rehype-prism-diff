import { visit } from 'unist-util-visit'
import { toString } from 'hast-util-to-string'
import { fromString } from 'hast-util-from-string'
import type { Plugin } from 'unified'
import type { Element, ElementContent } from 'hast'

export interface Options {
  /** remove the first character which used to mark */
  remove?: boolean
  classMapping?: Partial<Record<'diff' | 'deleted' | 'inserted' | 'warn' | 'comment', string | string[]>>
}

function addClass(node: Element, className: string | string[]) {
  if (!node.properties) return
  if (!node.properties.className) {
    if (Array.isArray(className)) node.properties.className = className
    else node.properties.className = [className]
  }
  if (Array.isArray(className)) (node.properties.className as string[]).push(...className)
  else (node.properties.className as string[]).push(className)
}

const rehypePrismDiff: Plugin<[Options?], Element> = (
  option = {
    remove: false
  }
) => {
  const classMapping = Object.assign(
    {
      diff: 'code-diff',
      deleted: 'diff-deleted',
      inserted: 'diff-inserted',
      warn: 'diff-warn',
      comment: 'diff-comment'
    },
    option.classMapping || {}
  ) as NonNullable<Required<Options['classMapping']>>

  return (tree: Element) => {
    visit(tree, 'element', (node, _index, parent) => {
      if (!parent || parent.tagName !== 'pre' || !('tagName' in node) || node.tagName !== 'code') {
        return
      }
      const meta: string = node.data && <string>node.data.meta ? <string>node.data.meta : ''
      if (!meta.toLowerCase().includes('diff'.toLowerCase())) return

      addClass(node, classMapping.diff)
      node.children.forEach((line: ElementContent) => {
        if (line.type !== 'element') return
        const lineString = toString(line)
        const match = lineString.match(/^(\+|-|!|#).+/)?.[1]
        if (match) {
          const matchMap: Record<string, 'deleted' | 'inserted' | 'warn' | 'comment'> = {
            '+': 'inserted',
            '-': 'deleted',
            '#': 'comment',
            '!': 'warn'
          }
          addClass(line, classMapping[matchMap[match]])
          if (option?.remove) {
            removeFirstChar(line)
          }
        }
      })
    })
  }

  function removeFirstChar(line: Element) {
    line.children.forEach((item) => {
      if (item.type !== 'text') return
      const itemString = toString(item)
      if (itemString.match(/^\+|-|!|#/)) fromString(item, itemString.substring(1))
    })
  }
}
export default rehypePrismDiff
