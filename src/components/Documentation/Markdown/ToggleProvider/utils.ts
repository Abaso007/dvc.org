export interface ToggleData {
  texts: string[]
  checkedInd: number
  parentText: string | null
}

export interface TogglesData {
  [key: string]: ToggleData
}

export const makeTextUrlFriendly = (val: string): string =>
  val.replace(/[^\w\-._~]/g, '-').replace(/-+/g, '-')

export const convertTabTextToQueryText = (
  text: string,
  parentText: string | null
): string => makeTextUrlFriendly(`${parentText ? `${parentText} ` : ''}${text}`)

export const getUrlQueryVal = (query: string, param: string): string => {
  const params = new URLSearchParams(query)
  return params.get(param) || ''
}

export const getSelectedIndexBasedOffQueryVal = (
  texts: string[],
  queryVal: string,
  parentText: string | null
): number => {
  const urlFriendlyTexts = texts.map(text =>
    convertTabTextToQueryText(text, parentText)
  )
  const index = urlFriendlyTexts.findIndex(text => queryVal.startsWith(text))
  return index > -1 ? index : 0
}

export const syncToggleSelection = (
  togglesData: TogglesData,
  id: string,
  newInd: number
): { selectedTabText: string; updated: TogglesData } | null => {
  const currentToggle = togglesData[id]

  if (!currentToggle) {
    return null
  }

  const selectedTabText = currentToggle.texts[newInd]
  const updated: TogglesData = { ...togglesData }

  for (const [key, value] of Object.entries(updated)) {
    if (key === id) {
      updated[id] = { ...updated[id], checkedInd: newInd }
      continue
    }
    const index = value.texts.indexOf(selectedTabText)
    if (index !== -1) {
      updated[key] = { ...updated[key], checkedInd: index }
    }
  }

  return { selectedTabText, updated }
}
