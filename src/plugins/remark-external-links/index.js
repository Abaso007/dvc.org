export default async ({ markdownAST }) => {
  const { visit } = await import('unist-util-visit')

  visit(markdownAST, 'link', node => {
    if (!node.url || !/^https?:\/\//.test(node.url)) return

    node.data = node.data || {}
    node.data.hProperties = node.data.hProperties || {}
    node.data.hProperties.target = '_blank'
    node.data.hProperties.rel = 'nofollow noopener noreferrer'
  })
}
