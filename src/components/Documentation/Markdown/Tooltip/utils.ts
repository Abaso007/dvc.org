interface GlossaryItem {
  desc: string
  match: string[]
  name: string
}

export const normalizeTooltipText = (text: string): string =>
  text.replace(/\n/g, ' ').toLowerCase()

export const findGlossaryMatch = (
  contents: GlossaryItem[],
  text: string
): { description: string; header: string } | null => {
  const normalizedText = normalizeTooltipText(text)

  for (const item of contents) {
    if (item.match.some(word => word.toLowerCase() === normalizedText)) {
      return { description: item.desc, header: item.name }
    }
  }

  return null
}
