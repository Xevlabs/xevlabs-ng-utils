import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component'
import { TranslocoModule } from '@ngneat/transloco'
import { MaterialModule } from './material/material.module'
import { FlexLayoutModule } from '@angular/flex-layout'
import { ConfirmationDirective } from './core/directives/confirmation.directive'

@NgModule({
	imports: [
		CommonModule,
		TranslocoModule,
		MaterialModule,
		FlexLayoutModule
	],
	declarations: [
		ConfirmationModalComponent,
		ConfirmationDirective
	],
	exports: [
		ConfirmationDirective
	]
})
export class XevlabsUiUtilsModule {
}
