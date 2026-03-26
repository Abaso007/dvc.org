import cn from 'clsx/lite'
import { SyntheticEvent, useEffect, useState } from 'react'

import { ReactComponent as ExternalLinkIcon } from '../../../../../images/external-link.svg'
import { getPathWithSource } from '../../../../../utils/shared/sidebar'
import Link from '../../../../Link'
import ICONS from '../icons'
import * as styles from '../styles.module.css'

interface ISidebarMenuItemProps {
  children?: Array<{ label: string; path: string; source: boolean | string }>
  currentPath: string
  label: string
  path: string
  source: boolean | string
  onClick: (isLeafItemClicked: boolean) => void
  activePaths?: Array<string>
  type?: string
  style?: string
  icon?: string
}

const SidebarMenuItem: React.FC<ISidebarMenuItemProps> = ({
  children,
  currentPath,
  label,
  path,
  activePaths,
  onClick,
  style,
  icon,
  type
}) => {
  const [isExpanded, setIsExpanded] = useState(
    activePaths && activePaths.includes(path)
  )

  useEffect(() => {
    setIsExpanded(activePaths && activePaths.includes(path))
  }, [activePaths, path])

  const isCurrent = currentPath === path
  const isRootParent =
    activePaths && activePaths.length > 1 && activePaths[0] === path

  const isLeafItem = children === undefined || children.length === 0

  const currentLevelOnClick = (
    event: SyntheticEvent<HTMLAnchorElement>
  ): void => {
    if (event.currentTarget.getAttribute('aria-current') === 'page') {
      event.preventDefault()
      setIsExpanded(!isExpanded)
    }
    onClick(isLeafItem)
  }

  const bulletIconClick = (event: SyntheticEvent<HTMLSpanElement>): void => {
    event.preventDefault()
    setIsExpanded(!isExpanded)
  }

  // Fetch a special icon if one is defined
  const IconComponent = icon && ICONS[icon]
  const iconElement = IconComponent ? (
    <IconComponent className={styles.specialIcon} />
  ) : null

  const className = cn(
    styles.sectionLink,
    isExpanded && styles.active,
    isCurrent && styles.current,
    isRootParent && 'docSearch-lvl0',
    'link-with-focus',
    style && styles[style]
  )

  const bulletIconClassName = cn(
    styles.sidebarDefaultBullet,
    isExpanded && styles.active,
    isCurrent && styles.currentBullet,
    isLeafItem && styles.sidebarLeafBullet
  )

  const bulletIconJSX = isLeafItem ? (
    <span className={bulletIconClassName}></span>
  ) : (
    <span
      onClick={bulletIconClick}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          bulletIconClick(e)
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={isExpanded ? `Collapse ${label}` : `Expand ${label}`}
      className={bulletIconClassName}
    ></span>
  )

  const parentElement =
    type === 'external' ? (
      <Link
        href={path}
        id={path}
        className={className}
        onClick={currentLevelOnClick}
        target="_blank"
      >
        {iconElement ?? <span className={bulletIconClassName}></span>}
        {label}{' '}
        <ExternalLinkIcon
          className={styles.externalLinkIcon}
          aria-hidden="true"
        />
      </Link>
    ) : (
      <Link
        href={getPathWithSource(path)}
        id={path}
        className={className}
        onClick={currentLevelOnClick}
        aria-current={isCurrent ? 'page' : undefined}
      >
        {iconElement ?? bulletIconJSX}
        {label}
      </Link>
    )

  return (
    <>
      {parentElement}
      {children && (
        <div
          className={styles.collapse}
          data-expanded={isExpanded || undefined}
        >
          <div className={styles.collapseInner}>
            {children.map(item => (
              <SidebarMenuItem
                key={item.path}
                currentPath={currentPath}
                activePaths={activePaths}
                onClick={onClick}
                {...item}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default SidebarMenuItem
