import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as plausible from '../../../utils/front/plausible'

import Nav from './index'

vi.spyOn(plausible, 'logEvent')

describe('Nav', () => {
  beforeEach(() => {
    vi.mocked(plausible.logEvent).mockClear()
    document.body.removeAttribute('data-docs-page')
  })

  it('uses the regular menu toggle outside docs pages', () => {
    const onToggle = vi.fn()

    render(<Nav opened={false} onToggle={onToggle} onClose={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))

    expect(onToggle).toHaveBeenCalled()
  })

  it('dispatches docs sidebar events on docs pages and syncs hamburger state', () => {
    const docsToggleListener = vi.fn()
    document.body.setAttribute('data-docs-page', '')
    document.addEventListener('docs-sidebar-toggle', docsToggleListener)

    render(<Nav opened={false} onToggle={vi.fn()} onClose={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))

    expect(docsToggleListener).toHaveBeenCalled()

    act(() => {
      document.dispatchEvent(
        new CustomEvent('docs-sidebar-state', { detail: { open: true } })
      )
    })

    expect(screen.getByRole('button', { name: 'Close menu' })).toBeTruthy()

    document.removeEventListener('docs-sidebar-toggle', docsToggleListener)
  })

  it('closes on Escape and logs get started clicks', () => {
    const onClose = vi.fn()

    render(<Nav opened={true} onToggle={vi.fn()} onClose={onClose} />)

    fireEvent.click(screen.getByText('Get Started'))

    expect(plausible.logEvent).toHaveBeenCalledWith('Nav', {
      Item: 'get-started'
    })
    expect(onClose).toHaveBeenCalled()

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(onClose).toHaveBeenCalledTimes(2)
  })
})
