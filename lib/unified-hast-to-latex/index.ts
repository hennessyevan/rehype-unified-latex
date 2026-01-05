import type { Root as HastRoot, Text, Content as HastContent } from 'hast'
import * as Latex from '@unified-latex/unified-latex-types'
import {
  getBody,
  hastNodeToLatex,
  isParagraph,
  hasFollowingParagraph,
} from './collect-body.ts'
import { applyMetaToLatex, getHead } from './collect-meta.ts'

export type HastNode = HastContent | HastRoot

export function unifiedHastToLatex() {
  return (tree: HastRoot) => convertHastToLatexAst(tree)
}

export function convertHastToLatexAst(tree: HastRoot): Latex.Root {
  const head = getHead(tree)
  const body = getBody(tree)

  const content: Latex.Node[] = []

  const meaningfulChildren = body?.children ?? []

  for (let i = 0; i < meaningfulChildren.length; i += 1) {
    const child = meaningfulChildren[i]
    const latexNodes = hastNodeToLatex(child)

    content.push(...latexNodes)

    if (
      isParagraph(child) &&
      hasFollowingParagraph(meaningfulChildren, i + 1)
    ) {
      content.push({ type: 'parbreak' })
    }
  }

  // wrap in begin{document} ... end{document}
  content.unshift({
    type: 'macro',
    content: 'begin',
    args: [
      {
        type: 'argument',
        content: [{ type: 'string', content: 'document' }],
        openMark: '{',
        closeMark: '}',
      },
    ],
  })
  content.push({
    type: 'macro',
    content: 'end',
    args: [
      {
        type: 'argument',
        content: [{ type: 'string', content: 'document' }],
        openMark: '{',
        closeMark: '}',
      },
    ],
  })
  // add appropriate document meta
  content.unshift({
    type: 'macro',
    content: 'documentclass',
    args: [
      {
        type: 'argument',
        content: [{ type: 'string', content: 'book' }],
        openMark: '{',
        closeMark: '}',
      },
    ],
  })

  const root = applyMetaToLatex(tree, { type: 'root', content })

  return root
}
