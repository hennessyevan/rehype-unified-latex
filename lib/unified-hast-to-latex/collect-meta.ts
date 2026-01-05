import type { Root as HastRoot, Element } from 'hast'
import * as Latex from '@unified-latex/unified-latex-types'

export function getHead(tree: HastRoot): Element | undefined {
  const html = tree.children.find(
    (node): node is Element =>
      node.type === 'element' && node.tagName === 'html'
  )

  if (!html) return undefined

  return html.children.find(
    (node): node is Element =>
      node.type === 'element' && node.tagName === 'head'
  )
}

export function applyMetaToLatex(
  tree: HastRoot,
  latexAst: Latex.Root
): Latex.Root {
  const head = getHead(tree)

  if (!head) {
    return latexAst
  }

  const metaNodes: Latex.Node[] = []

  for (const child of head.children) {
    if (child.type === 'element' && child.tagName === 'meta') {
      const nameAttr = child.properties?.name
      const contentAttr = child.properties?.content

      if (typeof nameAttr === 'string' && typeof contentAttr === 'string') {
        if (nameAttr.toLowerCase() === 'author') {
          metaNodes.push({
            type: 'macro',
            content: 'author',
            args: [
              {
                type: 'argument',
                content: [{ type: 'string', content: contentAttr }],
                openMark: '{',
                closeMark: '}',
              },
            ],
          })
        } else if (nameAttr.toLowerCase() === 'title') {
          metaNodes.push({
            type: 'macro',
            content: 'title',
            args: [
              {
                type: 'argument',
                content: [{ type: 'string', content: contentAttr }],
                openMark: '{',
                closeMark: '}',
              },
            ],
          })
        }
      }
    }
  }

  // Insert meta nodes before \begin{document}
  const beginDocIndex = latexAst.content.findIndex(
    (node) =>
      node.type === 'macro' &&
      node.content === 'begin' &&
      node.args?.[0]?.content?.[0]?.type === 'string' &&
      node.args?.[0]?.content?.[0]?.content === 'document'
  )

  if (beginDocIndex !== -1) {
    latexAst.content.splice(beginDocIndex, 0, ...metaNodes)
  } else {
    latexAst.content.unshift(...metaNodes)
  }

  return latexAst
}
