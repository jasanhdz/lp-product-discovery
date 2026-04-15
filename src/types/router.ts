export type LayoutType = 'AUTH' | 'APP'

export interface AppRoute {
  title: string
  path: string
  component: React.FC
  layout: LayoutType
}