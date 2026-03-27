import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
})

// Shared mutable location for tests that need to control useLocation
export const mockLocation: Record<string, string> = {
  hash: '',
  host: 'doc.dvc.org',
  origin: 'https://doc.dvc.org',
  search: ''
}

afterEach(() => {
  mockLocation.hash = ''
  mockLocation.host = 'doc.dvc.org'
  mockLocation.origin = 'https://doc.dvc.org'
  mockLocation.search = ''
})

vi.mock('@gatsbyjs/reach-router', () => ({
  useLocation: () => mockLocation
}))

vi.mock('@docsearch/core', () => ({
  useDocSearch: () => ({ openModal: () => {} })
}))

vi.mock('@docsearch/modal/button', () => ({
  DocSearchButton: () => null
}))

vi.mock('gatsby', async () => {
  const { createElement } = await import('react')
  return {
    Link: ({ to, children, ...rest }: Record<string, unknown>) =>
      createElement(
        'a',
        { 'data-testid': 'gatsby-link', href: to, ...rest },
        children as string
      ),
    Script: () => null,
    navigate: vi.fn()
  }
})
