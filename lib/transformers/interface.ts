import type { fromHtml } from 'hast-util-from-html'
import type * as Ast from '@unified-latex/unified-latex-types'

export type TransformerOptions =
  | {
      output: 'saveToDisk'
      sourceFilePath: string
    }
  | {
      output: 'returnToCaller'
      sourceFilePath?: never
    }

export type Hast = ReturnType<typeof fromHtml>
export type Html = string
export type FilePath = string
export type LatexAst = Ast.Root

export type TransformerInput = Html | Hast
export type TransformerOutput = Hast | LatexAst
export type TransformerResult<
  Input extends TransformerInput,
  Output extends TransformerOutput,
  Options extends TransformerOptions
> = Options['output'] extends 'saveToDisk'
  ? { filePath: FilePath }
  : { data: Output }
