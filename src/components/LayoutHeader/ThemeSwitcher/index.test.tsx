import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import ThemeSwitcher from './index'

function applyThemeMode(mode: 'system' | 'light' | 'dark') {
  document.body.dataset.themeMode = mode
  document.body.classList.toggle('dark-mode', mode === 'dark')
  document.body.classList.toggle('light-mode', mode === 'light')
  window.__themeMode = mode
  window.__resolvedTheme = mode === 'dark' ? 'dark' : 'light'
}

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    window.__setThemeMode = vi.fn(mode => {
      applyThemeMode(mode)
    })

    applyThemeMode('system')
  })

  it('starts from the current global theme mode', () => {
    render(<ThemeSwitcher />)

    expect(
      screen.getByRole('button', { name: 'Switch to light mode' })
    ).toBeTruthy()
  })

  it('cycles through light, dark, and system modes', () => {
    render(<ThemeSwitcher />)

    const button = screen.getByRole('button', { name: 'Switch to light mode' })

    fireEvent.click(button)

    expect(window.__setThemeMode).toHaveBeenCalledWith('light')
    expect(button.getAttribute('aria-label')).toBe('Switch to dark mode')

    fireEvent.click(button)

    expect(window.__setThemeMode).toHaveBeenCalledWith('dark')
    expect(button.getAttribute('aria-label')).toBe(
      'Switch to system preference'
    )

    fireEvent.click(button)

    expect(window.__setThemeMode).toHaveBeenCalledWith('system')
    expect(button.getAttribute('aria-label')).toBe('Switch to light mode')
  })
})
