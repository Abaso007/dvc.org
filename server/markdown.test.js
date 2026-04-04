import path from 'node:path'

import { describe, it, expect, vi, beforeEach } from 'vitest'

const readFileMock = vi.fn()

vi.mock('node:fs/promises', () => ({
  default: { readFile: readFileMock },
  readFile: readFileMock
}))

vi.mock('../src/utils/shared/sidebar.js', () => ({
  getItemByPath: vi.fn()
}))

const { getItemByPath } = await import('../src/utils/shared/sidebar.js')
const { default: createMarkdownMiddleware, _private } =
  await import('./markdown.js')

const makeRes = () => ({
  set: vi.fn(),
  type: vi.fn(),
  send: vi.fn()
})

describe('server markdown middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('skips non-GET/HEAD requests', async () => {
    getItemByPath.mockReturnValue({ source: '/docs/start/index.md' })
    const middleware = createMarkdownMiddleware()
    const next = vi.fn()

    for (const method of ['POST', 'PUT', 'DELETE', 'PATCH']) {
      next.mockClear()
      const req = {
        method,
        path: '/start.md',
        headers: {}
      }
      await middleware(req, {}, next)
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith()
    }
  })

  it('resolves markdown file path only for docs sidebar sources', () => {
    getItemByPath.mockReturnValue({ source: '/docs/start/index.md' })
    expect(_private.resolveMarkdownFilePath('/start')).toBe(
      path.resolve('content', 'docs', 'start', 'index.md')
    )

    getItemByPath.mockReturnValue({ source: '/docs/index.md' })
    expect(_private.resolveMarkdownFilePath('/')).toBe(
      path.resolve('content', 'docs', 'index.md')
    )

    getItemByPath.mockReturnValue({ source: '/static/asset.md' })
    expect(_private.resolveMarkdownFilePath('/start')).toBeNull()
  })

  it('rejects path traversal in sidebar source', () => {
    getItemByPath.mockReturnValue({
      source: '/docs/../../../etc/passwd'
    })
    expect(_private.resolveMarkdownFilePath('/start')).toBeNull()

    getItemByPath.mockReturnValue({ source: '/docs/start/../../secret.md' })
    expect(_private.resolveMarkdownFilePath('/start')).toBeNull()
  })

  it('returns null when sidebar item has no source', () => {
    getItemByPath.mockReturnValue(null)
    expect(_private.resolveMarkdownFilePath('/start')).toBeNull()

    getItemByPath.mockReturnValue(undefined)
    expect(_private.resolveMarkdownFilePath('/start')).toBeNull()

    getItemByPath.mockReturnValue({ source: false })
    expect(_private.resolveMarkdownFilePath('/start')).toBeNull()

    getItemByPath.mockReturnValue({ source: 123 })
    expect(_private.resolveMarkdownFilePath('/start')).toBeNull()
  })

  it('serves markdown when .md extension is used', async () => {
    getItemByPath.mockReturnValue({ source: '/docs/start/index.md' })
    readFileMock.mockResolvedValue('# Start')

    const middleware = createMarkdownMiddleware({
      cacheControl: 'public, max-age=60'
    })
    const req = {
      method: 'GET',
      path: '/start.md',
      headers: { accept: 'text/html' },
      accepts: vi.fn(() => 'text/html')
    }
    const res = makeRes()
    const next = vi.fn()

    await middleware(req, res, next)

    expect(res.set).toHaveBeenCalledWith('Cache-Control', 'public, max-age=60')
    expect(res.type).toHaveBeenCalledWith('text/markdown; charset=utf-8')
    expect(res.send).toHaveBeenCalledWith('# Start')
    expect(next).not.toHaveBeenCalled()
  })

  it('falls through for .md extension when page not found', async () => {
    getItemByPath.mockReturnValue(null)

    const middleware = createMarkdownMiddleware()
    const req = {
      method: 'GET',
      path: '/unknown.md',
      headers: {},
      accepts: vi.fn(() => 'text/html')
    }
    const next = vi.fn()

    await middleware(req, {}, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith()
  })

  it('serves markdown for nested index.md paths', async () => {
    getItemByPath.mockReturnValue({ source: '/docs/start/index.md' })
    readFileMock.mockResolvedValue('# Start')

    const middleware = createMarkdownMiddleware()
    const req = {
      method: 'GET',
      path: '/start/index.md',
      headers: {},
      accepts: vi.fn(() => 'text/html')
    }
    const res = makeRes()
    const next = vi.fn()

    await middleware(req, res, next)

    expect(getItemByPath).toHaveBeenCalledWith('/start')
    expect(res.type).toHaveBeenCalledWith('text/markdown; charset=utf-8')
    expect(res.send).toHaveBeenCalledWith('# Start')
  })

  it('rejects bare /.md request', async () => {
    const middleware = createMarkdownMiddleware()
    const req = {
      method: 'GET',
      path: '/.md',
      headers: {},
      accepts: vi.fn(() => 'text/html')
    }
    const next = vi.fn()

    await middleware(req, {}, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith()
  })

  it('falls through when doc source is not mapped', async () => {
    getItemByPath.mockReturnValue(false)
    const middleware = createMarkdownMiddleware()
    const req = {
      method: 'GET',
      path: '/unknown.md',
      headers: {}
    }
    const next = vi.fn()

    await middleware(req, {}, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith()
  })

  it('falls through on missing markdown source file', async () => {
    getItemByPath.mockReturnValue({ source: '/docs/start/index.md' })
    const enoent = new Error('ENOENT: no such file or directory')
    enoent.code = 'ENOENT'
    readFileMock.mockRejectedValue(enoent)

    const middleware = createMarkdownMiddleware()
    const req = {
      method: 'GET',
      path: '/start.md',
      headers: {}
    }
    const res = makeRes()
    const next = vi.fn()

    await middleware(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith()
  })

  it('passes read errors to error handler', async () => {
    getItemByPath.mockReturnValue({ source: '/docs/start/index.md' })
    const err = new Error('boom')
    readFileMock.mockRejectedValue(err)

    const middleware = createMarkdownMiddleware()
    const req = {
      method: 'GET',
      path: '/start.md',
      headers: {}
    }
    const res = makeRes()
    const next = vi.fn()

    await middleware(req, res, next)

    expect(next).toHaveBeenCalledWith(err)
  })
})
