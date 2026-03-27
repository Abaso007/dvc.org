import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { mockLocation } from '../../../../test/setup'

import Callout from './index'

describe('Callout', () => {
  beforeEach(() => {
    mockLocation.hash = ''
  })

  it('renders static admonition content with the provided title', () => {
    render(
      <Callout type="warn" title="Watch out">
        <p>Danger zone</p>
      </Callout>
    )

    expect(screen.getByText('Watch out')).toBeTruthy()
    expect(screen.getByText('Danger zone')).toBeTruthy()
  })

  it('toggles collapsible details content', () => {
    render(
      <Callout collapsible triggerContent="More details" title="Ignored">
        <p>Hidden body</p>
      </Callout>
    )

    const trigger = screen.getByRole('button', { name: /more details/i })

    expect(trigger.getAttribute('aria-expanded')).toBe('false')

    fireEvent.click(trigger)

    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByText('Hidden body')).toBeTruthy()
  })

  it('opens collapsible content when the current hash matches its id', () => {
    mockLocation.hash = '#matching-id'

    render(
      <Callout collapsible id="matching-id" triggerContent="Open from hash">
        <p>Expanded body</p>
      </Callout>
    )

    expect(
      screen
        .getByRole('button', { name: /open from hash/i })
        .getAttribute('aria-expanded')
    ).toBe('true')
  })
})
