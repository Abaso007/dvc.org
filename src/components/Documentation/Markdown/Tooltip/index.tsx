import { useMemo } from 'react'

import useGlossary from '../../../../utils/front/glossary'
import ShowOnly from '../../../ShowOnly'

import DesktopView from './DesktopView'
import MobileView from './MobileView'
import { findGlossaryMatch } from './utils'

const Tooltip: React.FC<{ text: string }> = ({ text }) => {
  const glossary = useGlossary()

  const matched = useMemo(
    () => findGlossaryMatch(glossary.contents, text),
    [glossary.contents, text]
  )

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
