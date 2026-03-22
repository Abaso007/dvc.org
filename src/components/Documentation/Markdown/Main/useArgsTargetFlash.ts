import { useEffect } from 'react'

const ARG_JUMP_LINK_SELECTOR =
  'a.token.arg[href^="#"], a[data-synopsis-flag][href^="#"]'
const ARG_TARGET_FLASH_CLASS = 'arg-target-flash'
const ARG_TARGET_FLASH_DURATION = 1000
const SCROLL_SETTLE_DELAY = 100

function safeDecodeURI(s: string): string {
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}

export const useArgsTargetFlash = (): void => {
  useEffect(() => {
    let frameId: number | null = null
    let timeoutId: number | null = null
    // Track whether the last flash was triggered by a click so
    // the subsequent hashchange event can skip the redundant flash.
    let clickTriggered = false

    const flashRow = (id: string) => {
      const target = document.getElementById(id)
      const row = target?.closest('li')
      if (!row) return

      if (frameId !== null) window.cancelAnimationFrame(frameId)
      if (timeoutId !== null) window.clearTimeout(timeoutId)
      frameId = null
      timeoutId = null

      row.classList.remove(ARG_TARGET_FLASH_CLASS)
      frameId = window.requestAnimationFrame(() => {
        frameId = null
        row.classList.add(ARG_TARGET_FLASH_CLASS)
        timeoutId = window.setTimeout(() => {
          timeoutId = null
          row.classList.remove(ARG_TARGET_FLASH_CLASS)
        }, ARG_TARGET_FLASH_DURATION)
      })
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const link = target.closest<HTMLAnchorElement>(ARG_JUMP_LINK_SELECTOR)
      if (!link) return
      const id = safeDecodeURI(link.getAttribute('href')?.slice(1) || '')
      if (id) {
        clickTriggered = true
        window.setTimeout(() => flashRow(id), SCROLL_SETTLE_DELAY)
      }
    }

    // Flash on hash change (e.g. back/forward navigation)
    const handleHash = () => {
      if (clickTriggered) {
        clickTriggered = false
        return
      }
      const hash = safeDecodeURI(window.location.hash.slice(1))
      if (hash) window.setTimeout(() => flashRow(hash), SCROLL_SETTLE_DELAY)
    }

    const root = document.getElementById('markdown-root')
    root?.addEventListener('click', handleClick, true)
    window.addEventListener('hashchange', handleHash)

    // Flash on initial load if URL has a hash
    if (window.location.hash) handleHash()

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId)
      if (timeoutId !== null) window.clearTimeout(timeoutId)
      // Clean up any lingering flash class
      document
        .querySelector(`li.${ARG_TARGET_FLASH_CLASS}`)
        ?.classList.remove(ARG_TARGET_FLASH_CLASS)
      root?.removeEventListener('click', handleClick, true)
      window.removeEventListener('hashchange', handleHash)
    }
  }, [])
}
