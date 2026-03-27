import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import Layout from './index'

vi.mock('../../Search/SearchTrigger', () => ({ default: () => null }))

// SidebarMenu needs mock buttons for the test to simulate leaf/non-leaf clicks
vi.mock('./SidebarMenu', () => ({
  default: ({
    onClick
  }: {
    currentPath: string
    onClick: (isLeafItemClicked: boolean) => void
  }) => (
    <>
      <button onClick={() => onClick(false)}>Non-leaf</button>
      <button onClick={() => onClick(true)}>Leaf</button>
    </>
  )
}))

describe('Documentation Layout', () => {
  beforeEach(() => {
    document.body.removeAttribute('data-docs-page')
  })

  it('sets and cleans up data-docs-page on mount/unmount', () => {
    const { unmount } = render(
      <Layout currentPath="/docs/current">Body</Layout>
    )

    expect(document.body.hasAttribute('data-docs-page')).toBe(true)

    unmount()

    expect(document.body.hasAttribute('data-docs-page')).toBe(false)
  })

  it('broadcasts sidebar state changes when the docs toggle event fires', () => {
    const stateListener = vi.fn()
    document.addEventListener('docs-sidebar-state', stateListener)

    render(<Layout currentPath="/docs/current">Body</Layout>)

    expect(stateListener).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: { open: false } })
    )

    act(() => {
      document.dispatchEvent(new Event('docs-sidebar-toggle'))
    })

    expect(stateListener.mock.lastCall?.[0]).toEqual(
      expect.objectContaining({ detail: { open: true } })
    )

    document.removeEventListener('docs-sidebar-state', stateListener)
  })

  it('closes the sidebar on leaf menu clicks', () => {
    const stateListener = vi.fn()
    document.addEventListener('docs-sidebar-state', stateListener)

    render(<Layout currentPath="/docs/current">Body</Layout>)

    act(() => {
      document.dispatchEvent(new Event('docs-sidebar-toggle'))
    })
    fireEvent.click(screen.getByText('Leaf'))

    expect(stateListener).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: { open: false } })
    )

    document.removeEventListener('docs-sidebar-state', stateListener)
  })
})
