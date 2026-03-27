import { describe, expect, it } from 'vitest'

import { findGlossaryMatch, normalizeTooltipText } from './utils'

describe('Tooltip utils', () => {
  it('normalizes tooltip text before matching', () => {
    expect(normalizeTooltipText('DVC\nProject')).toBe('dvc project')
  })

  it('matches glossary aliases case-insensitively', () => {
    expect(
      findGlossaryMatch(
        [
          {
            name: 'DVC project',
            desc: 'A repository tracked by DVC.',
            match: ['DVC project', 'project']
          }
        ],
        'dvc\nproject'
      )
    ).toEqual({
      header: 'DVC project',
      description: 'A repository tracked by DVC.'
    })
  })

  it('returns null when the glossary has no matching alias', () => {
    expect(
      findGlossaryMatch(
        [
          {
            name: 'Workspace',
            desc: 'Working tree files.',
            match: ['workspace']
          }
        ],
        'pipeline'
      )
    ).toBeNull()
  })
})
