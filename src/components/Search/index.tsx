import { DocSearch } from '@docsearch/core'
import type { DocSearchModal as DocSearchModalType } from '@docsearch/modal/modal'
import { navigate } from 'gatsby'
import { useState } from 'react'

import Link from '../Link'

const options = {
  appId: '98DVTFT919',
  apiKey: '5341554faa7a8255d383af495c6d3ed2',
  indexName: 'dvc-docs'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Hit({ hit, children }: { hit: any; children: React.ReactNode }) {
  return <Link href={hit.url}>{children}</Link>
}

let DocSearchModal: typeof DocSearchModalType | null = null

async function importModalIfNeeded() {
  if (DocSearchModal) return
  const [mod] = await Promise.all([
    import('@docsearch/modal/modal'),
    import('@docsearch/css')
  ])
  DocSearchModal = mod.DocSearchModal
}

export function loadSearchModal() {
  return importModalIfNeeded()
}

export default function SearchProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [modalLoaded, setModalLoaded] = useState(false)

  const loadModal = () => {
    if (DocSearchModal) {
      setModalLoaded(true)
      return
    }
    importModalIfNeeded().then(() => setModalLoaded(true))
  }

  return (
    <DocSearch onOpen={loadModal}>
      {children}
      {modalLoaded && DocSearchModal && (
        <DocSearchModal
          {...options}
          navigator={{
            navigate({ itemUrl }: { itemUrl: string }) {
              navigate(itemUrl)
            }
          }}
          transformItems={items =>
            items.map(item => ({
              ...item,
              url: item.url.replace(new URL(item.url).origin, '')
            }))
          }
          hitComponent={Hit}
        />
      )}
    </DocSearch>
  )
}
