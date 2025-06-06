import { PropsWithChildren } from 'react'

import * as styles from './styles.module.css'

interface IElementProps {
  attributes?: Record<string, unknown>
  el?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span'
}

const Element: React.FC<PropsWithChildren<IElementProps>> = ({
  children,
  el,
  attributes
}) => {
  switch (el) {
    case 'h6':
      return <h6 {...attributes}>{children}</h6>
    case 'h5':
      return <h5 {...attributes}>{children}</h5>
    case 'h4':
      return <h4 {...attributes}>{children}</h4>
    case 'h3':
      return <h3 {...attributes}>{children}</h3>
    case 'h2':
      return <h2 {...attributes}>{children}</h2>
    case 'h1':
      return <h1 {...attributes}>{children}</h1>
    default:
      return <span {...attributes}>{children}</span>
  }
}

interface IAutoLinkHeaderProps {
  id: string
  el?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span'
  anchorStyle?: Record<string, unknown>
}

const AutoLinkElement: React.FC<PropsWithChildren<IAutoLinkHeaderProps>> = ({
  children,
  id,
  el,
  anchorStyle
}) => {
  return (
    <>
      <Element
        el={el}
        attributes={{
          className: styles.autoLinkEl,
          id,
          style: { position: 'relative' }
        }}
      >
        {children}
        <a
          href={`#${id}`}
          aria-label={`${id.replace(/-/g, ' ')} permalink`}
          className="anchor after"
          style={anchorStyle}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            height="16"
            version="1.1"
            viewBox="0 0 16 16"
            width="16"
          >
            <path
              fillRule="evenodd"
              d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
            ></path>
          </svg>
        </a>
      </Element>
    </>
  )
}

export default AutoLinkElement
