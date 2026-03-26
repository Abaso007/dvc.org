import cn from 'classnames'
import { PropsWithChildren } from 'react'

import 'github-markdown-css/github-markdown.css'
import useCustomYtEmbeds from '../../../../utils/front/useCustomYtEmbeds'
import {
  getItemByPath,
  getPathWithSource
} from '../../../../utils/shared/sidebar'
import Link from '../../../Link'
import * as sharedStyles from '../../styles.module.css'
import Tutorials from '../../TutorialsLinks'

import * as styles from './styles.module.css'
import * as themeStyles from './theme.module.css'
import { useArgsTargetFlash } from './useArgsTargetFlash'

interface IMainProps {
  githubLink: string
  tutorials?: { [type: string]: string }
  prev?: string
  next?: string
}

const Main: React.FC<PropsWithChildren<IMainProps>> = ({
  children,
  prev,
  next,
  tutorials,
  githubLink
}) => {
  useArgsTargetFlash()
  useCustomYtEmbeds()

  const prevItem = prev ? getItemByPath(prev) : null
  const nextItem = next ? getItemByPath(next) : null

  return (
    <div className={styles.content} id="markdown-root">
      {tutorials && (
        <div className={styles.tutorialsWrapper}>
          <Tutorials tutorials={tutorials} compact={true} />
        </div>
      )}
      <Link
        className={cn(sharedStyles.button, styles.githubLink)}
        href={githubLink}
        target="_blank"
      >
        <i className={cn(sharedStyles.buttonIcon, styles.githubIcon)} /> Edit on
        GitHub
      </Link>
      <div className={cn('markdown-body', themeStyles.code)}>{children}</div>
      <div className={styles.navButtons}>
        {prev && prevItem?.label && (
          <Link className={cn(styles.navButton, styles.prevLink)} href={prev}>
            <span className={styles.navButtonTitle}>
              <i className={cn(styles.navButtonIcon, styles.prev)} />
              <span>{prevItem.label}</span>
            </span>
          </Link>
        )}
        {next && nextItem?.label && (
          <Link
            className={cn(styles.navButton, styles.nextLink)}
            href={getPathWithSource(next)}
          >
            <span className={styles.navButtonTitle}>
              <span>{nextItem.label}</span>
              <i className={cn(styles.navButtonIcon, styles.next)} />
            </span>
          </Link>
        )}
      </div>
    </div>
  )
}

export default Main
