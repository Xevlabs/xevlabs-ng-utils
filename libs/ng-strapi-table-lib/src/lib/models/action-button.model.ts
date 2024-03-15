export interface ActionButtonModel {
  type: string,
  icon: string,
  color: 'accent' | 'primary' | 'warn',
  tooltipKey?: string,
  conditionField?: string,
  conditionValue?: any,
  conditionOperator?: '>' | '<' | '>=' | '<=' | '===' | '!=='
}
