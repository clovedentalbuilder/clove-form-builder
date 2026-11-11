export interface FxOperand{
  fxDataId: string | null,
  key: string | null,
  icon?: string,
  value?: string,
  type?: 'TEXT' | 'FIELD'
}
