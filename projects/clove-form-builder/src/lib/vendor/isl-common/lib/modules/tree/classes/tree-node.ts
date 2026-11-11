export interface TreeNode {
  name: string;
  description?: string;
  icon?: string;
  href?: string;
  badge?: string;
  style?: 'primary' | 'secondary' | 'danger' | 'default';
  iconStyle?: 'primary' | 'secondary' | 'danger' | 'default';
  children?: TreeNode[];
  collapsed?: boolean;
  hovered?: boolean;
}
