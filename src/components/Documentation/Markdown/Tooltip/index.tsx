import { useMemo } from 'react'

import useGlossary from '../../../../utils/front/glossary'
import ShowOnly from '../../../ShowOnly'

import DesktopView from './DesktopView'
import MobileView from './MobileView'

const Tooltip: React.FC<{ text: string }> = ({ text }) => {
  const glossary = useGlossary()
  const normalizedText = text.replace(/\n/g, ' ').toLowerCase()

  const matched = useMemo(() => {
    for (const item of glossary.contents) {
      if (item.match.some(word => word.toLowerCase() === normalizedText)) {
        return { description: item.desc, header: item.name }
      }
    }
    return null
  }, [glossary.contents, normalizedText])

  if (!matched) {
    return <span>{text}</span>
  }

  return (
    <>
      <ShowOnly on="desktop" as="span">
        <DesktopView
          description={matched.description}
          header={matched.header}
          text={text}
        />
      </ShowOnly>
      <ShowOnly on="mobile" as="span">
        <MobileView
          description={matched.description}
          header={matched.header}
          text={text}
        />
      </ShowOnly>
    </>
  )
}

export default Tooltip
