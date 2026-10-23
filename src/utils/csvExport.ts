/**
 * Client-side CSV Export Utility
 * Converts an array of objects into a downloaded CSV file in the browser.
 */

export function exportToCSV<T extends Record<string, unknown>>(
  filename: string,
  rows: T[],
  headers: { key: keyof T; label: string }[]
): void {
  if (!rows || rows.length === 0) return

  // Build header row
  const headerLine = headers.map((h) => `"${h.label.replace(/"/g, '""')}"`).join(',')

  // Build data rows
  const dataLines = rows.map((row) => {
    return headers
      .map((h) => {
        const val = row[h.key]
        if (val === null || val === undefined) return '""'
        const strVal = String(val).replace(/"/g, '""')
        return `"${strVal}"`
      })
      .join(',')
  })

  const csvContent = [headerLine, ...dataLines].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
