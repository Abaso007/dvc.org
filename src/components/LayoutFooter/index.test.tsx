import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import LayoutFooter from './index'

describe('LayoutFooter', () => {
  beforeEach(() => {
    window.__ucCmp = {
      showFirstLayer: vi.fn(),
      showSecondLayer: vi.fn()
    }
  })

  it('opens the correct privacy settings layers from legal buttons', () => {
    render(<LayoutFooter />)

    fireEvent.click(screen.getByText('Privacy Settings'))
    fireEvent.click(
      screen.getByText('Do not share or sell my personal information')
    )

    expect(window.__ucCmp?.showSecondLayer).toHaveBeenCalled()
    expect(window.__ucCmp?.showFirstLayer).toHaveBeenCalled()
  })
})
