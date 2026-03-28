import { useDocSearch } from '@docsearch/core'
import { Search } from 'lucide-react'

import * as styles from './styles.module.css'

import { loadSearchModal } from './index'

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
      </button>
    </div>
  )
}

export default SearchTrigger
