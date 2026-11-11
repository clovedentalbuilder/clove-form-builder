import {FxEventTrigger} from "./fx-event-trigger";

export interface FxEvent{
  trigger: FxEventTrigger
  type: 'SCRIPT' | 'LOGIC',
  script: string,
  logics: { id: string }[]
}
