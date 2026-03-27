import { useDocSearch } from '@docsearch/core'
import { Search } from 'lucide-react'

import * as styles from './styles.module.css'

import { loadSearchModal } from './index'

const isMac =
  typeof navigator !== 'undefined' &&
  /Mac|iPod|iPhone|iPad/.test(navigator.platform)

const SearchTrigger: React.FC = () => {
  const { openModal } = useDocSearch()

  const handleClick = () => {
    loadSearchModal().then(openModal)
  }

  return (
    <div className={styles.desktopWrapper}>
      <button className={styles.desktopTrigger} onClick={handleClick}>
        <Search
          size={18}
          strokeWidth={2}
          className={styles.desktopTriggerIcon}
        />
        <span className={styles.desktopTriggerText}>Search docs</span>
        <kbd className={styles.desktopTriggerKbd}>{isMac ? '⌘' : 'Ctrl+'}K</kbd>
      </button>
    </div>
  )
}

export default SearchTrigger
