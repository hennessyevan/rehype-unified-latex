import fs from 'fs/promises'
import { unified } from 'unified'
import { unifiedHastToLatex } from '../unified-hast-to-latex.ts'
import invariant from 'tiny-invariant'
import type {
  Hast,
  LatexAst,
  TransformerOptions,
  TransformerResult,
} from './interface.ts'

export async function hastToTex<Options extends TransformerOptions>(
  hast: Hast,
  options: Options = { output: 'returnToCaller' } as Options
): Promise<TransformerResult<Hast, LatexAst, Options>> {
  // Convert HAST to LaTeX AST using the unified plugin
  const { convertHastToLatexAst } = await import('../unified-hast-to-latex.ts')
  
  const latexAst = convertHastToLatexAst(hast as any)

  if (options.output === 'saveToDisk') {
    invariant(
      'sourceFilePath' in options,
      'sourceFilePath must be provided when output is saveToDisk'
    )

    const filePath = (options.sourceFilePath as string).replace(
      /\.hast\.json$/i,
      '.latex.json'
    )

    await fs.writeFile(filePath, JSON.stringify(latexAst, null, 2))

    return { filePath } as TransformerResult<Hast, LatexAst, Options>
  }

  return { data: latexAst } as TransformerResult<Hast, LatexAst, Options>
}
