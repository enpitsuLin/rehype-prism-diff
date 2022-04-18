# rehypre-prism-diff

A rehypre plugin allow not only `diff` language but also all language to show github flavored highlight diff block, suport both [rehype-prism-plus](https://github.com/timlrx/rehype-prism-plus) and [rehype-prism](https://github.com/mapbox/rehype-prism)

![sample](https://user-images.githubusercontent.com/29378026/163522813-e0466685-7075-4075-9530-3abd2c885b13.png)

## Installation

```sh
pnpm add rehype-prism-diff
```

**Notice:** This package is [Pure ESM package](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)

## Usage

use this package [as a rehype plugin.](https://github.com/rehypejs/rehype/blob/master/doc/plugins.md#using-plugins)

## Styling

This plugin will add class `code-diff` to `<code>` block and add the corresponding class for each `code-line` according to the first character of each line

You should add stylesheet by yourself, for exmpale:

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

</details>

## Contribute

If you have any suggestion or bug, please feel free to [open an issue](https://github.com/enpitsuLin/rehype-prism-diff/issues/new)

## License

MIT
