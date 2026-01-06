# rehype-unified-latex

A small unifiedJS plugin that turns an HTML/HAST tree into a LaTeX AST (see [unified-latex](https://github.com/uclmr/unified-latex)) so you can render, lint, or emit `.tex` from HTML sources. Designed for book-like documents where you want headings, chapters, metadata, and inline formatting to map cleanly into LaTeX.

## Installation

```bash
npm install rehype-unified-latex rehype-parse unified @unified-latex/unified-latex-util-to-string
```

## Quick start

The plugin consumes a HAST tree (e.g., from `rehype-parse`) and returns a unified-latex AST you can stringify with `@unified-latex/unified-latex-util-to-string`.

```ts
import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import { rehypeUnifiedLatex } from 'rehype-unified-latex'
import { unifiedLatexStringCompiler } from '@unified-latex/unified-latex-util-to-string'

const html = `<html><head><meta name="title" content="Example" /></head><body><h1>Hello</h1><p>World.</p></body></html>`

// Build HAST from HTML
const rehypeProcessor = unified()
  .use(rehypeParse)
  .use(rehypeUnifiedLatex, { documentClass: 'book' })

const hast = rehypeProcessor.parse(html)
const latexAst = rehypeProcessor.runSync(hast as any)

// Turn LaTeX AST into a .tex string
const latex = unified().use(unifiedLatexStringCompiler).stringify(latexAst)

console.log(latex)
```

## API

### `rehypeUnifiedLatex(options?)`

Unified plugin that converts HAST → unified-latex AST.

Options:

- `documentClass`: `'article' | 'report' | 'book'` (default: `'book'`). Used for the emitted `\documentclass{...}` macro.

## Notes & limitations

- Currently focused on book-like prose from ebook sources. Lists, images, tables, math, footnotes, etc., are not yet mapped.
- HTML must include a `<html><head>...</head><body>...</body></html>` structure for metadata extraction.
- Output is a LaTeX AST; you choose when/how to stringify or compile it.
- API and output shape will change; pinned at `0.x` while iterating.
