/**
 * gatsby-remark-synopsis
 *
 * Transforms ```usage code blocks into a clean, linked synopsis.
 * Expects pre-cleaned format (no "usage:" prefix, no boilerplate flags).
 *
 * Exported helpers (parseUsage, escapeHtml) are tested in index.test.js.
 */

export function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function flagLink(text, { required = false } = {}) {
  const m = text.match(/^(-{1,2}[\w-]+)(.*)/)
  if (!m) return escapeHtml(text)
  const [, name, val] = m
  const href = encodeURIComponent(name)
  const valHtml = escapeHtml(val)
    .replace(/(&lt;[^&]+&gt;)/g, '<span data-synopsis-value>$1</span>')
    .replace(/(\{[\w,]+\})/g, '<span data-synopsis-value>$1</span>')
  const req = required ? ' data-synopsis-required' : ''
  return `<a data-synopsis-flag${req} href="#${href}">${escapeHtml(name)}${valHtml}</a>`
}

// Split rest into tokens, respecting nested brackets
function tokenize(text) {
  const tokens = []
  let i = 0
  while (i < text.length) {
    if (text[i] === ' ') {
      i++
      continue
    }

    let j = i
    if (text[i] === '[') {
      // Nested bracket matching
      let depth = 0
      while (j < text.length) {
        if (text[j] === '[') depth++
        else if (text[j] === ']') {
          depth--
          if (depth === 0) break
        }
        j++
      }
      j++
    } else if (text[i] === '{') {
      j = text.indexOf('}', i) + 1 || text.length
    } else if (text[i] === '<') {
      j = text.indexOf('>', i) + 1 || text.length
    } else if (text[i] === '-') {
      // Flag, possibly with <value>
      while (j < text.length && text[j] !== ' ') j++
      if (text[j] === ' ' && text[j + 1] === '<') {
        j = text.indexOf('>', j) + 1 || text.length
      }
    } else {
      while (j < text.length && text[j] !== ' ') j++
    }

    let token = text.substring(i, j)
    i = j
    // Absorb trailing " ..." (but not for {subcmd} groups)
    if (token[0] !== '{' && text.substring(i, i + 4) === ' ...') {
      token += ' ...'
      i += 4
    }
    tokens.push(token)
  }
  return tokens
}

function renderToken(token, pagePath) {
  // {sub,cmds} → linked subcommand group
  if (token[0] === '{') {
    const base = pagePath.replace(/\/$/, '')
    const names = token.slice(1, -1).split(',')
    const links = names.map(s => {
      const n = s.trim()
      return `<a data-synopsis-subcmd href="${escapeHtml(base)}/${encodeURIComponent(n)}">${escapeHtml(n)}</a>`
    })
    return `<span data-synopsis-subcmds>{${links.join('<span data-synopsis-sep aria-hidden="true">|</span>')}}</span>`
  }

  // [...] → optional flag or positional
  if (token[0] === '[') {
    const inner = token.slice(1, -1)

    // Either group: [--a | --b] or [--a <v> | --b <v>]
    if (inner.includes('|') && inner.includes('-')) {
      const parts = inner
        .split('|')
        .map(s => s.trim())
        .filter(p => p[0] === '-')
      if (parts.length > 1) {
        return `<span data-synopsis-either>[${parts.map(p => flagLink(p)).join(' | ')}]</span>`
      }
      if (parts.length === 1) return `[${flagLink(parts[0])}]`
    }

    // Single flag: [-f] or [--flag <value>]
    if (inner.match(/^-/)) return `[${flagLink(inner)}]`

    // Positional: [<out>], [targets ...] — strip <> for display
    const cleaned = token.replace(/<([^>]+)>/g, '$1')
    return `<span data-synopsis-positionals>${escapeHtml(cleaned)}</span>`
  }

  // <positional> → strip angle brackets for display
  if (token[0] === '<') {
    const m = token.match(/^<([^>]+)>(.*)/)
    if (m) {
      const [, inner, rest] = m
      if (inner.includes('|')) {
        const html = inner
          .split('|')
          .map(p => escapeHtml(p.trim()))
          .join(' <span data-synopsis-sep aria-hidden="true">|</span> ')
        return `<span data-synopsis-positionals>${html}${escapeHtml(rest)}</span>`
      }
      return `<span data-synopsis-positionals>${escapeHtml(inner)}${escapeHtml(rest)}</span>`
    }
  }

  // -flag or -flag <value> → required flag link
  if (token[0] === '-') return flagLink(token, { required: true })

  // Bare word: targets, ...
  return `<span data-synopsis-positionals>${escapeHtml(token)}</span>`
}

export function parseUsage(text) {
  const flat = text.replace(/\n\s*/g, ' ').replace(/\s+/g, ' ').trim()
  if (!flat.startsWith('dvc')) return null

  const cmdMatch = flat.match(/^(dvc(?:\s+(?![-[{<])[\w-]+)*)\s*(.*)$/)
  if (!cmdMatch) return null
  return { command: cmdMatch[1], rest: cmdMatch[2] }
}

function buildSynopsisHtml(parsed, pagePath) {
  const tokens = tokenize(parsed.rest)
  const parts = [
    `<span data-synopsis-cmd>${escapeHtml(parsed.command)}</span>`,
    ...tokens.map(t => renderToken(t, pagePath))
  ]
  const indent = Math.min(parsed.command.length + 1, 40)
  const hasSubcmds = tokens.some(t => t[0] === '{')
  const attr = hasSubcmds ? ' data-synopsis-has-subcmds' : ''

  return `<div data-synopsis${attr} role="group" aria-label="Command synopsis" style="--cmd-len:${indent}ch"><code>${parts.join(' ')}</code></div>`
}

export default async ({ markdownAST, getNode, markdownNode }) => {
  const { visit } = await import('unist-util-visit')
  const parentNode = getNode(markdownNode.parent)
  const pagePath = '/' + (parentNode?.relativeDirectory || '')

  visit(markdownAST, 'code', (node, index, parent) => {
    if (node.lang !== 'usage' || !parent || index === undefined) return
    const parsed = parseUsage(node.value)
    if (!parsed) return
    parent.children[index] = {
      type: 'html',
      value: buildSynopsisHtml(parsed, pagePath)
    }
  })
  return markdownAST
}
