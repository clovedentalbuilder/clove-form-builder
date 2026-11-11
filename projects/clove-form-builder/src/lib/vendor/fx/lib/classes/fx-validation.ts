export interface FxValidation{
  key: string,
  message: string,
  enable?: boolean,
  $description?: string,
  properties?: FxValidationProperty[];
}

export interface FxValidationProperty{
  key: string,
  $title: string,
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'OPTIONS',
  value: any
}
