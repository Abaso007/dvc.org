import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import Link from './index'

// Isolate link-type routing from redirect rules
vi.mock('../../utils/shared/redirects', () => ({
  getRedirect: () => [null, null]
}))

describe('Link', () => {
  it('uses a plain anchor for external links and adds safe defaults', () => {
    render(<Link href="https://example.com/docs">External docs</Link>)

    const link = screen.getByText('External docs')

    expect(link.getAttribute('href')).toBe('https://example.com/docs')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noopener noreferrer')
  })

  it('uses Gatsby links for internal navigation', () => {
    render(<Link href="/docs/get-started">Internal docs</Link>)

    expect(screen.getByTestId('gatsby-link').getAttribute('href')).toBe(
      '/docs/get-started'
    )
  })

  it('keeps fragment links as plain anchors', () => {
    render(<Link href="#section">Jump</Link>)

    const link = screen.getByText('Jump')

    expect(link.getAttribute('href')).toBe('#section')
    expect(screen.queryByTestId('gatsby-link')).toBeNull()
  })
})
