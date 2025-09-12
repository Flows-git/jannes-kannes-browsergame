import path from 'node:path'
import process from 'node:process'
import csvToJson from 'convert-csv-to-json'

export async function parseCsvToJson<CsvT = Record<string, string | number>, TransformedT = Record<string, any>>(filename: string, transformer: (row: CsvT) => TransformedT) {
  const rows: CsvT[] = await csvToJson.getJsonFromCsv(path.join(process.cwd(), 'data', `${filename}.csv`))

  const parsedRows: TransformedT[] = []

  for (const row of rows) {
    parsedRows.push(transformer(row))
  }

  return parsedRows
}
