import includes from 'lodash/includes'

import { SidebarItemClickHandler } from '..'
import { structure } from '../../../../../utils/shared/sidebar'
import SidebarMenuItem from '../Item'
import * as styles from '../styles.module.css'

export interface IInnerSidebarProps {
  activePaths?: string[]
  currentPath: string
  onClick: SidebarItemClickHandler
}

const SidebarSections: React.FC<IInnerSidebarProps> = ({
  activePaths,
  currentPath,
  onClick
}) => {
  return (
    <div className={styles.sections}>
      <div className={styles.sectionLinks}>
        {structure.map(item => (
          <SidebarMenuItem
            key={item.path}
            currentPath={currentPath}
            activePaths={
              activePaths && includes(activePaths, item.path)
                ? activePaths
                : undefined
            }
            onClick={onClick}
            {...item}
          />
        ))}
      </div>
    </div>
  )
}

export default SidebarSections
