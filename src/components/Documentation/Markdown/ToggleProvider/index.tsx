import cn from 'clsx/lite'
import {
  createContext,
  FC,
  Fragment,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from 'react'

import * as styles from './styles.module.css'
import {
  convertTabTextToQueryText,
  getSelectedIndexBasedOffQueryVal,
  getUrlQueryVal,
  syncToggleSelection,
  type TogglesData
} from './utils'

interface ITogglesContext {
  addNewToggle?: (
    id: string,
    texts: string[],
    parentText: string | null
  ) => void
  updateToggleInd?: (id: string, newInd: number) => void
  togglesData?: TogglesData
}

export const TogglesContext = createContext<ITogglesContext>({})

const setUrlQuery = (href: string, param: string, value: string): void => {
  const formattedVal = convertTabTextToQueryText(value, null)
  const url = new URL(href)
  url.searchParams.set(param, formattedVal)
  window.history.pushState({}, '', url.href)
}

export const TogglesProvider: React.FC<
  PropsWithChildren<Record<never, never>>
> = ({ children }) => {
  const [togglesData, setTogglesData] = useState<TogglesData>({})
  const lastSelectedTabRef = useRef<string | null>(null)

  useEffect(() => {
    lastSelectedTabRef.current = getUrlQueryVal(window.location.search, 'tab')
  }, [])

  const addNewToggle = useCallback(
    (id: string, texts: string[], parentText: string | null): void => {
      setTogglesData(prev => {
        if (prev[id]) return prev
        let lastSelected = lastSelectedTabRef.current
        if (lastSelected === null) {
          lastSelected = getUrlQueryVal(window.location.search, 'tab')
        }
        return {
          ...prev,
          [id]: {
            texts,
            checkedInd: getSelectedIndexBasedOffQueryVal(
              texts,
              lastSelected,
              parentText
            ),
            parentText
          }
        }
      })
    },
    []
  )

  const updateToggleInd = useCallback(
    (id: string, newInd: number): void => {
      const result = syncToggleSelection(togglesData, id, newInd)

      if (!result) {
        return
      }

      setUrlQuery(
        window.location.href,
        'tab',
        convertTabTextToQueryText(
          result.selectedTabText,
          result.updated[id].parentText
        )
      )
      lastSelectedTabRef.current = result.selectedTabText
      setTogglesData(result.updated)
    },
    [togglesData]
  )

  const contextValue = useMemo(
    () => ({ addNewToggle, updateToggleInd, togglesData }),
    [addNewToggle, updateToggleInd, togglesData]
  )

  return (
    <TogglesContext.Provider value={contextValue}>
      {children}
    </TogglesContext.Provider>
  )
}

const ToggleTab: React.FC<
  PropsWithChildren<{
    id: string
    title: string
    ind: number
    onChange: () => void
    checked: boolean
  }>
> = ({ children, id, checked, ind, onChange, title }) => {
  const inputId = `tab-${id}-${ind}`

  return (
    <>
      <input
        id={inputId}
        type="radio"
        name={`toggle-${id}`}
        onChange={onChange}
        checked={checked}
      />
      <label className={styles.tabHeading} htmlFor={inputId}>
        {title}
      </label>
      {children}
    </>
  )
}

export const Toggle: React.FC<{
  height?: string
  children: Array<{ props: { title: string } } | string>
}> = ({ height, children }) => {
  const toggleId = useId()
  const {
    addNewToggle = (): null => null,
    updateToggleInd = (): null => null,
    togglesData = {}
  } = useContext(TogglesContext)
  const tabs: Array<{ props: { title: string } } | string> = children.filter(
    child => child !== '\n'
  )
  const tabsTitles = tabs.map(tab =>
    typeof tab === 'object' ? tab.props.title : ''
  )
  const toggleEl = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tabParent =
      toggleEl.current && toggleEl.current.closest('.toggle .tab')
    const labelParentText =
      tabParent &&
      tabParent.previousElementSibling &&
      tabParent.previousElementSibling.textContent

    if (!togglesData[toggleId]) {
      addNewToggle(toggleId, tabsTitles, labelParentText)
    }
  }, [addNewToggle, tabsTitles, toggleId, togglesData])

  return (
    <div className={cn('toggle', styles.toggle)} ref={toggleEl}>
      {tabs.map((tab, i) => (
        <ToggleTab
          ind={i}
          key={i}
          title={tabsTitles[i]}
          id={toggleId}
          checked={
            i === (togglesData[toggleId] ? togglesData[toggleId].checkedInd : 0)
          }
          onChange={(): void => updateToggleInd(toggleId, i)}
        >
          <div
            className={cn('tab', styles.tab)}
            style={{
              minHeight: height
            }}
          >
            {tab as string}
          </div>
        </ToggleTab>
      ))}
    </div>
  )
}

export const Tab: FC<PropsWithChildren<Record<never, never>>> = ({
  children
}) => {
  return <Fragment>{children}</Fragment>
}
