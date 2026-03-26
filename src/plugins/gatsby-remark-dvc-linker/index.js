import apiLinker from './apiLinker.js'
import commandLinker from './commandLinker.js'
import liveLinker from './liveLinker.js'
import simpleLinker from './simpleLinker.js'

// Lifting up the AST visitor in order not to repeat the
// calculations times the amount of linkers we have
export default async ({ markdownAST }, { simpleLinkerTerms }) => {
  const { visit } = await import('unist-util-visit')
  const linkers = [
    liveLinker,
    commandLinker(simpleLinkerTerms),
    apiLinker,
    simpleLinker(simpleLinkerTerms)
  ]
  visit(markdownAST, 'inlineCode', (...args) => {
    let result = Array(...args)
    for (const fn of linkers) {
      result = fn(result)
    }
  })
  return markdownAST
}
