export interface NavLink{
  name: string
  divider?: boolean,
  description?: string
  icon?: string
  path?: string
  routerLink?: string,
  style?: 'primary' | 'danger' | 'default'
  state?: 'active' | 'inactive' | 'disabled' | 'hidden'
  children?: NavLink[]
}
