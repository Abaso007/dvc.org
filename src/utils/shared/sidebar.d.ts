export interface ISidebarItem {
  label: string
  path: string
  source: string
  prev: string
  next: string
  icon?: string
  style?: string
  children?: ISidebarItem[]
}

export const structure: ISidebarItem[]

export function findChildWithSource(source: ISidebarItem): ISidebarItem

export function getItemByPath(path: string): ISidebarItem

export function getPathWithSource(path: string): string

export function getParentsListFromPath(path: string): string[]
