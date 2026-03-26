import fs from 'fs'
import path from 'path'

import { remark } from 'remark'
import { visit } from 'unist-util-visit'
import { describe, it, expect } from 'vitest'

import { escapeHtml, parseUsage } from './index.js'

describe('escapeHtml', () => {
  it('escapes all five HTML-sensitive characters', () => {
    expect(escapeHtml('<a href="x">&\'test')).toBe(
      '&lt;a href=&quot;x&quot;&gt;&amp;&#39;test'
    )
  })

  it('returns empty string unchanged', () => {
    expect(escapeHtml('')).toBe('')
  })
})

describe('parseUsage', () => {
  it('returns null for non-matching text', () => {
    expect(parseUsage('some random text')).toBeNull()
    expect(parseUsage('git push --force')).toBeNull()
  })

  it('parses a minimal command', () => {
    const result = parseUsage('dvc doctor')
    expect(result.command).toBe('dvc doctor')
    expect(result.rest).toBe('')
  })

  it('parses command with optional flags', () => {
    const result = parseUsage('dvc init [--no-scm] [-f] [--subdir] [directory]')
    expect(result.command).toBe('dvc init')
    expect(result.rest).toContain('--no-scm')
    expect(result.rest).toContain('[directory]')
  })

  it('parses subcommand pattern', () => {
    const result = parseUsage('dvc remote {add,default,remove,modify,list} ...')
    expect(result.command).toBe('dvc remote')
    expect(result.rest).toContain('{add,default,remove,modify,list}')
  })

  it('parses multiline usage', () => {
    const text = `dvc push [-j <number>] [-r <name>] [-a] [-T]
           [--all-commits] [--glob] [-d] [-R]
           [--run-cache | --no-run-cache]
           [targets ...]`
    const result = parseUsage(text)
    expect(result.command).toBe('dvc push')
    expect(result.rest).toContain('--all-commits')
    expect(result.rest).toContain('--run-cache | --no-run-cache')
    expect(result.rest).toContain('[targets ...]')
  })

  it('parses required flags', () => {
    const text = `dvc stage add -n <name> [-f] [-d <path>]
                 [-o <filename>] command`
    const result = parseUsage(text)
    expect(result.command).toBe('dvc stage add')
    expect(result.rest).toContain('-n <name>')
  })

  it('parses either groups', () => {
    const text =
      'dvc import-db [--sql <query> | --table <name>] [--conn <name>]'
    const result = parseUsage(text)
    expect(result.command).toBe('dvc import-db')
    expect(result.rest).toContain('--sql <query> | --table <name>')
  })

  // -----------------------------------------------------------------------
  // Challenging real-world patterns (new clean format)
  // -----------------------------------------------------------------------

  it('handles many flags across continuation lines (exp run)', () => {
    const text = `dvc exp run [-f] [-i] [-s] [-p] [-P] [-R] [-n <name>]
            [-S [<filename>:]<override_pattern>] [--queue] [--run-all]
            [-j <number>] [--temp] [-r <experiment_rev>] [-C <path>]
            [-m <message>] [--downstream] [--force-downstream] [--pull]
            [--dry] [--allow-missing] [-k] [--ignore-errors]
            [targets ...]`
    const result = parseUsage(text)
    expect(result.command).toBe('dvc exp run')
    expect(result.rest).toContain('--queue')
    expect(result.rest).toContain('--allow-missing')
    expect(result.rest).toContain('[targets ...]')
  })

  it('handles compact pipe [-R|-T] (list)', () => {
    const text = `dvc list [-R|-T] [-L <depth>] [--dvc-only] [--json]
         [--rev [<commit>]] [--config <path>] [--remote <name>]
         [--remote-config [<name>=<value> ...]] [--size] [--show-hash]
         url [path]`
    const result = parseUsage(text)
    expect(result.command).toBe('dvc list')
    expect(result.rest).toContain('[-R|-T]')
    expect(result.rest).toContain('url')
  })

  it('handles import-db with either groups', () => {
    const text = `dvc import-db [--sql <query> | --table <name>] [--conn <name>]
              [--output-format [{csv,json}]] [-o [<path>]] [-f]`
    const result = parseUsage(text)
    expect(result.command).toBe('dvc import-db')
    expect(result.rest).toContain('--sql <query> | --table <name>')
    expect(result.rest).toContain('--output-format')
  })

  it('handles deeply nested brackets (stage add)', () => {
    const text = `dvc stage add -n <name> [-f] [-d <path>]
                 [-p [<filename>:]<params_list>]
                 [-o <filename>] [-O <filename>] [-c <filename>]
                 [--outs-persist <filename>]
                 [--outs-persist-no-cache <filename>] [-m <path>]
                 [-M <path>] [--plots <path>] [--plots-no-cache <path>]
                 [-w <path>] [--always-changed] [--desc <text>] [--run]
                 command`
    const result = parseUsage(text)
    expect(result.command).toBe('dvc stage add')
    expect(result.rest).toContain('-n <name>')
    expect(result.rest).toContain('[--always-changed]')
    expect(result.rest).toContain('command')
  })

  it('handles subcommands (plots)', () => {
    const result = parseUsage('dvc plots {show,diff,templates} ...')
    expect(result.command).toBe('dvc plots')
    expect(result.rest).toContain('{show,diff,templates}')
  })

  it('handles [--no-exec | --no-download] either group (import-url)', () => {
    const text = `dvc import-url [--to-remote] [-r <name>]
           [--no-exec | --no-download] [-j <number>] [-f]
           [--version-aware] [--fs-config <name>=<value>] url [out]`
    const result = parseUsage(text)
    expect(result.command).toBe('dvc import-url')
    expect(result.rest).toContain('--no-exec | --no-download')
  })

  it('handles artifacts/get with normalized metavars', () => {
    const text = `dvc artifacts get [--rev [<version>]] [--stage [<stage>]]
                  [-o [<path>]] [--show-url] [-j <number>] [-f]
                  [--config <path>] [--remote <name>]
                  [--remote-config [<key>=<value> ...]] url name`
    const result = parseUsage(text)
    expect(result.command).toBe('dvc artifacts get')
    expect(result.rest).toContain('[--config <path>]')
    expect(result.rest).toContain('[--remote <name>]')
    expect(result.rest).toContain('url')
    expect(result.rest).toContain('name')
  })
})

// ---------------------------------------------------------------------------
// Corpus test: parse every real ```usage block from the command reference docs
// Uses the remark markdown parser (same pipeline as Gatsby).
// ---------------------------------------------------------------------------

function extractUsageBlocks(dir) {
  const parser = remark()
  const blocks = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      blocks.push(...extractUsageBlocks(full))
    } else if (entry.name.endsWith('.md')) {
      const content = fs.readFileSync(full, 'utf-8')
      const tree = parser.parse(content)
      visit(tree, 'code', node => {
        if (node.lang !== 'usage') return
        const rel = path.relative(
          path.resolve('content/docs/command-reference'),
          full
        )
        blocks.push({ file: rel, text: node.value })
      })
    }
  }
  return blocks
}

const CORPUS_DIR = path.resolve('content/docs/command-reference')

describe('parseUsage corpus (all real usage blocks)', () => {
  const blocks = extractUsageBlocks(CORPUS_DIR)

  it('finds usage blocks in the corpus', () => {
    expect(blocks.length).toBeGreaterThan(50)
  })

  for (const { file, text } of blocks) {
    it(`parses ${file}`, () => {
      const result = parseUsage(text)
      expect(result).not.toBeNull()
      expect(result.command).toMatch(/^dvc\b/)
    })
  }
})
