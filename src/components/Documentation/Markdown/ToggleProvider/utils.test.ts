import { describe, expect, it } from 'vitest'

import {
  convertTabTextToQueryText,
  getSelectedIndexBasedOffQueryVal,
  makeTextUrlFriendly,
  syncToggleSelection,
  type TogglesData
} from './utils'

describe('ToggleProvider utils', () => {
  it('normalizes tab labels into stable query fragments', () => {
    expect(makeTextUrlFriendly('Python & CLI')).toBe('Python-CLI')
    expect(convertTabTextToQueryText('CLI', 'Getting Started')).toBe(
      'Getting-Started-CLI'
    )
  })

  it('finds the selected tab from the query value', () => {
    expect(
      getSelectedIndexBasedOffQueryVal(
        ['Python', 'R', 'CLI'],
        'Getting-Started-R',
        'Getting Started'
      )
    ).toBe(1)
    expect(
      getSelectedIndexBasedOffQueryVal(['Python', 'R'], 'Unknown', null)
    ).toBe(0)
  })

  it('synchronizes matching tab labels across toggle groups', () => {
    const togglesData: TogglesData = {
      topLevel: {
        texts: ['Python', 'CLI'],
        checkedInd: 0,
        parentText: null
      },
      nested: {
        texts: ['Bash', 'CLI'],
        checkedInd: 0,
        parentText: 'Install'
      },
      unrelated: {
        texts: ['Train', 'Deploy'],
        checkedInd: 1,
        parentText: null
      }
    }

    const result = syncToggleSelection(togglesData, 'topLevel', 1)

    expect(result).toEqual({
      selectedTabText: 'CLI',
      updated: {
        topLevel: {
          texts: ['Python', 'CLI'],
          checkedInd: 1,
          parentText: null
        },
        nested: {
          texts: ['Bash', 'CLI'],
          checkedInd: 1,
          parentText: 'Install'
        },
        unrelated: {
          texts: ['Train', 'Deploy'],
          checkedInd: 1,
          parentText: null
        }
      }
    })
    expect(togglesData.topLevel.checkedInd).toBe(0)
    expect(togglesData.nested.checkedInd).toBe(0)
  })

  it('returns null when asked to update an unknown toggle', () => {
    expect(syncToggleSelection({}, 'missing', 0)).toBeNull()
  })
})
