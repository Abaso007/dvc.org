import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import DesktopView from './index'

vi.mock('lodash/throttle', () => ({
  default: (fn: (...args: unknown[]) => void) =>
    Object.assign((...args: unknown[]) => fn(...args), {
      cancel: vi.fn()
    })
}))

describe('DesktopView', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0)
      return 1
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('shows tooltip content on hover and hides it after the delay', () => {
    render(
      <DesktopView
        description="<p>Tooltip body</p>"
        header="Tooltip title"
        text="Hover target"
      />
    )

    act(() => {
      fireEvent.mouseOver(screen.getByText('Hover target'))
    })

    expect(screen.getByText('Tooltip title')).toBeTruthy()
    expect(screen.getByText('Tooltip body')).toBeTruthy()

    act(() => {
      fireEvent.mouseLeave(screen.getByText('Hover target'))
      vi.advanceTimersByTime(100)
    })

    expect(screen.queryByText('Tooltip title')).toBeNull()
  })
})
