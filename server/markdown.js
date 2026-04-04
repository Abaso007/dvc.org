import fs from 'node:fs/promises'
import path from 'node:path'

import { getItemByPath } from '../src/utils/shared/sidebar.js'

const SIDEBAR_SOURCE_PREFIX = '/docs/'
const CONTENT_DOCS_ROOT = path.resolve('content', 'docs')

const isStaticContentRequest = req => ['GET', 'HEAD'].includes(req.method)

const resolveMarkdownFilePath = pathname => {
  const item = getItemByPath(pathname)
  if (!item || typeof item.source !== 'string') return null
  if (!item.source.startsWith(SIDEBAR_SOURCE_PREFIX)) return null

  const relativeSourcePath = item.source.slice(SIDEBAR_SOURCE_PREFIX.length)
  const filePath = path.resolve(CONTENT_DOCS_ROOT, relativeSourcePath)

  if (
    filePath !== CONTENT_DOCS_ROOT &&
    !filePath.startsWith(`${CONTENT_DOCS_ROOT}${path.sep}`)
  ) {
    return null
  }

  return filePath
}

const sendMarkdown = async (markdownFilePath, cacheControl, res, next) => {
  try {
    const markdown = await fs.readFile(markdownFilePath, 'utf8')

    if (cacheControl) {
      res.set('Cache-Control', cacheControl)
    }
    res.type('text/markdown; charset=utf-8')
    return res.send(markdown)
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return next()
    }
    return next(error)
  }
}

const createMarkdownMiddleware = ({ cacheControl } = {}) => {
  return async (req, res, next) => {
    if (!isStaticContentRequest(req)) return next()
    if (!req.path.endsWith('.md')) return next()

    // Reject bare /.md — canonical form is /index.md
    if (req.path === '/.md') return next()

    let stripped = req.path.slice(0, -3)
    // /index.md → /, /start/index.md → /start
    if (stripped.endsWith('/index')) {
      stripped = stripped.slice(0, -6) || '/'
    }
    const markdownFilePath = resolveMarkdownFilePath(stripped)
    if (!markdownFilePath) return next()
    return sendMarkdown(markdownFilePath, cacheControl, res, next)
  }
}

export default createMarkdownMiddleware
export const _private = {
  CONTENT_DOCS_ROOT,
  SIDEBAR_SOURCE_PREFIX,
  resolveMarkdownFilePath
}
