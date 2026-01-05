import fs from 'fs/promises'
import { fromHtml } from 'hast-util-from-html'
import invariant from 'tiny-invariant'
import type {
  FilePath,
  Hast,
  Html,
  TransformerOptions,
  TransformerResult,
} from './interface.ts'

export async function htmlToHast<Options extends TransformerOptions>(
  html: Html,
  options: Options = { output: 'returnToCaller' } as Options
): Promise<TransformerResult<Html, Hast, Options>> {
  const tree = fromHtml(html, { fragment: false })

  if (options.output === 'saveToDisk') {
    invariant(
      'sourceFilePath' in options,
      'sourceFilePath must be provided when output is saveToDisk'
    )

    const filePath = options.sourceFilePath.replace(
      /\.html?$/i,
      '.hast.json'
    ) as FilePath

    await fs.writeFile(filePath, JSON.stringify(tree, null, 2))

    return { filePath } as TransformerResult<Html, Hast, Options>
  }

  return { data: tree } as TransformerResult<Html, Hast, Options>
}
