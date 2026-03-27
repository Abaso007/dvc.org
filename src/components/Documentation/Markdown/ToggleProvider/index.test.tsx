import { fireEvent, render, screen } from '@testing-library/react'
import { createElement, type ComponentType, type ReactNode } from 'react'
import { beforeEach, describe, expect, it } from 'vitest'

import { Toggle, TogglesProvider } from './index'

const TestToggle = Toggle as unknown as ComponentType<{ children?: ReactNode }>

const createToggleChildren = (
  tabs: Array<{ content: string; title: string }>
) => tabs.map(({ content, title }) => createElement('div', { title }, content))

describe('TogglesProvider', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/docs')
  })

  it('initializes selected tabs from the query string', () => {
    window.history.pushState({}, '', '/docs?tab=CLI')

    render(
      <TogglesProvider>
        {createElement(
          TestToggle,
          null,
          ...createToggleChildren([
            { title: 'Python', content: 'Python content' },
            { title: 'CLI', content: 'CLI content' }
          ])
        )}
      </TogglesProvider>
    )

    const pythonTab = screen.getByLabelText('Python') as HTMLInputElement
    const cliTab = screen.getByLabelText('CLI') as HTMLInputElement

    expect(pythonTab.checked).toBe(false)
    expect(cliTab.checked).toBe(true)
  })

  it('syncs matching tab labels across toggles and updates the query string', () => {
    render(
      <TogglesProvider>
        {createElement(
          TestToggle,
          null,
          ...createToggleChildren([
            { title: 'Python', content: 'Python content' },
            { title: 'CLI', content: 'CLI content' }
          ])
        )}
        {createElement(
          TestToggle,
          null,
          ...createToggleChildren([
            { title: 'Bash', content: 'Bash content' },
            { title: 'CLI', content: 'Nested CLI content' }
          ])
        )}
      </TogglesProvider>
    )

    const cliTabs = screen.getAllByLabelText('CLI') as HTMLInputElement[]

    fireEvent.click(cliTabs[0])

    expect(cliTabs[0].checked).toBe(true)
    expect(cliTabs[1].checked).toBe(true)
    expect(window.location.search).toBe('?tab=CLI')
  })
})
