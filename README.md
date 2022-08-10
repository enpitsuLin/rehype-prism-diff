# rehypre-prism-diff

[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]

A rehypre plugin allow not only `diff` language but also all language to show github flavored highlight diff block, suport both [rehype-prism-plus](https://github.com/timlrx/rehype-prism-plus) and [rehype-prism](https://github.com/mapbox/rehype-prism)

![sample](https://user-images.githubusercontent.com/29378026/163522813-e0466685-7075-4075-9530-3abd2c885b13.png)

## Installation

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). In Node.js(version 12.20+, 14.14+,or 16.0+), install with npm:

```sh
npm install rehype-prism-diff
```

In Deno with [`esm.sh`][esmsh]:

```js
import RehypePrismDiff from 'https://esm.sh/rehype-prism-diff@1.1.0'
```

## Usage

use this package [as a rehype plugin.](https://github.com/rehypejs/rehype/blob/master/doc/plugins.md#using-plugins)

## Options

```typescript
export interface Options {
  /** remove the first character which used to mark */
  remove?: boolean
  classMapping?: Partial<Record<'diff' | 'deleted' | 'inserted' | 'warn' | 'comment', string | string[]>>
}
```

**`options.remove`**

`boolean`, default `false` - enable remove the first character which used to mark.

**`options.classMapping`**

`Record<'diff' | 'deleted' | 'inserted' | 'warn' | 'comment', string|string[]>` - custom className mapping.
properties:

- diff: the className which be added to `code` element.
- deleted\inserted\warn\comment: the className which be added to corresponding marked `span.code-line` element

## Styling

This plugin will add class `code-diff` to `code` element and add the corresponding class for each `span.code-line` element according to the first character of each line by default option.

So you should add stylesheet by yourself, for example:

```css
.code-line.diff-inserted {
  background-color: rgba(16, 185, 129, 0.2); /* Set inserted line (+) color */
}

.code-line.diff-deleted {
  background-color: rgba(239, 68, 68, 0.2); /* Set deleted line (-) color */
}

.code-line.diff-warn {
  background-color: rgba(104, 45, 15, 0.2); /* Set warn line (!) color */
}

.code-line.diff-comment {
  background-color: rgba(255, 255, 255, 0.2); /* Set comment line (#) color */
}
```

**Notice**: if you config `classMapping` option, you need customize the css file accordingly.

</details>

## Related

- [rehype-prism](https://github.com/mapbox/rehype-prism) - syntax highlighting with Prism via refractor
- [rehype-prism-plus](https://github.com/timlrx/rehype-prism-plus) - syntax highlighting with Prism via refractor with extras

## Contribute

If you have any suggestion or bug, please feel free to [open an issue](https://github.com/enpitsuLin/rehype-prism-diff/issues/new)

## License

MIT © [enpitsuLin](https://enpitsulin.xyz)

<!-- Definitions -->

[coverage-badge]: https://codecov.io/gh/enpitsuLin/rehype-prism-diff/branch/master/graph/badge.svg
[coverage]: https://codecov.io/gh/enpitsuLin/rehype-prism-diff
[downloads-badge]: https://img.shields.io/npm/dm/rehype-prism-diff.svg
[downloads]: https://www.npmjs.com/package/rehype-prism-diff
[size-badge]: https://img.shields.io/bundlephobia/minzip/rehype-prism-diff.svg
[size]: https://bundlephobia.com/result?p=rehype-prism-diff
[esmsh]: https://esm.sh
