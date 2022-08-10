import { rehype } from 'rehype'
import dedent from 'dedent'
import rehypePrismDiff, { Options } from '../src/'
import rehypePrism, { RehypePrismOptions } from 'rehype-prism'
import rehypePrismPlus from 'rehype-prism-plus'
import { visit } from 'unist-util-visit'
import type { Options as RehypePrismPlusOptions } from 'rehype-prism-plus/generator'
import type { Element } from 'hast'

const addMeta = (meta?: string) => {
  if (!meta) return
  return (tree: Element) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'code') {
        node.data = { meta: meta }
      }
    })
  }
}

describe('rehypre-prism plugin', () => {
  const processHtml = (
    html: string,
    setting?: { options?: RehypePrismOptions; optionsDiff?: Options; meta?: string }
  ) => {
    return rehype()
      .data('settings', { fragment: true })
      .use(addMeta, setting?.meta || '')
      .use(rehypePrism, setting?.options)
      .use(rehypePrismDiff, setting?.optionsDiff)
      .processSync(html)
      .toString()
  }

  test('should no diff', () => {
    const result = processHtml(
      dedent`
    <div>
      <pre>
      <code class="language-css">p { color: red }</code>
      </pre>
    </div>
    `
    )
    expect(result).toMatchSnapshot()
  })

  test('should add diff', () => {
    const result = processHtml(
      dedent`
    <div>
      <pre>
      <code class="language-css">p { color: red }</code>
      </pre>
    </div>
    `,
      {
        meta: 'diff'
      }
    )
    expect(result).toMatchSnapshot()
  })

  test('add inserted or deleted class to line', () => {
    const result = processHtml(
      dedent`
    <div>
      <pre>
      <code class="language-css">+ p { color: white }
- p { color: red }
! div { background: red }
# div { background: black }
      </code>
      </pre>
    </div>
    `,
      {
        meta: 'diff'
      }
    )
    expect(result).toMatchSnapshot()
  })

  test('option remove work', () => {
    const result = processHtml(
      dedent`   <div>
    <pre>
    <code class="language-css">+ p { color: white }
- p { color: red }
! div { background: red }
# div { background: black }
    </code>
    </pre>
  </div>`,
      { meta: 'diff', optionsDiff: { remove: true } }
    )
    expect(result).toMatchSnapshot()
  })

  test('option classMapping work', () => {
    const result = processHtml(
      dedent`   <div>
    <pre>
    <code class="language-css">+ p { color: white }
- p { color: red }
    </code>
    </pre>
  </div>`,
      { meta: 'diff', optionsDiff: { remove: true, classMapping: { diff: 'custom-diff' } } }
    )
    expect(result).toMatchSnapshot()
  })
})

describe('rehypre-prism-plus plugin', () => {
  const processHtml = (
    html: string,
    setting?: { options?: RehypePrismPlusOptions; optionsDiff?: Options; meta?: string }
  ) => {
    return rehype()
      .data('settings', { fragment: true })
      .use(addMeta, setting?.meta || '')
      .use(rehypePrismPlus, setting?.options)
      .use(rehypePrismDiff, setting?.optionsDiff)
      .processSync(html)
      .toString()
  }

  test('should no diff', () => {
    const result = processHtml(
      dedent`
    <div>
      <pre>
      <code class="language-css">p { color: red }</code>
      </pre>
    </div>
    `
    )
    expect(result).toMatchSnapshot()
  })

  test('should add diff', () => {
    const result = processHtml(
      dedent`
      <div>
        <pre>
        <code class="language-css">p { color: red }</code>
        </pre>
      </div>
    `,
      {
        meta: 'diff'
      }
    )
    expect(result).toMatchSnapshot()
  })

  test('add inserted or deleted class to line', () => {
    const result = processHtml(
      dedent`
    <div>
      <pre>
      <code class="language-css">+ p { color: white }
- p { color: red }
! div { background: red }
# div { background: black }
      </code>
      </pre>
    </div>
    `,
      {
        meta: 'diff'
      }
    )
    expect(result).toMatchSnapshot()
  })

  test('option remove work', () => {
    const result = processHtml(
      dedent`   <div>
    <pre>
    <code class="language-css">+ p { color: white }
- p { color: red }
! div { background: red }
# div { background: black }
    </code>
    </pre>
  </div>`,
      { meta: 'diff', optionsDiff: { remove: true } }
    )
    expect(result).toMatchSnapshot()
  })

  test('option classMapping work', () => {
    const result = processHtml(
      dedent`   <div>
    <pre>
    <code class="language-css">+ p { color: white }
- p { color: red }
    </code>
    </pre>
  </div>`,
      { meta: 'diff', optionsDiff: { remove: true, classMapping: { diff: 'custom-diff' } } }
    )
    expect(result).toMatchSnapshot()
  })
})
