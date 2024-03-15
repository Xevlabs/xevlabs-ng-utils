import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[xevlabsNgUtilsShowActionButton]'
})
export class ShowActionButtonDirective implements OnInit {
  @Input('xevlabsNgUtilsShowActionButton') condition!: any[];
  
  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit(): void {
    const [field, fieldValue, operator, conditionValue] = this.condition;
    
    if (!field || this.evaluateCondition(fieldValue, operator, conditionValue)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  private evaluateCondition(fieldValue: any, operator: string, conditionValue: any): boolean {
    switch (operator) {
      case '!==':
        return fieldValue !== conditionValue;
      case '<':
        return fieldValue < conditionValue;
      case '>':
        return fieldValue > conditionValue;
      case '<=':
        return fieldValue <= conditionValue;
      case '>=':
        return fieldValue >= conditionValue;
      default:
        return fieldValue === conditionValue;
    }
  }
}