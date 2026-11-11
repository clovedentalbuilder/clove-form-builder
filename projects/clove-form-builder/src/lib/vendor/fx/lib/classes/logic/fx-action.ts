export interface FxAction{
  key: string,
  $title: string,
  $description?: string,
  properties: FxActionProperty[],
}

export interface FxActionProperty {
  key: string,
  $title: string,
  $description?: string,
  type: 'VALUE' | 'ACTION' | 'LOGIC' | 'FIELD'
  value: number | boolean | string | FxAction[] | FxLogicFiled[]
}

export interface FxLogicFiled{
  id: string
}


