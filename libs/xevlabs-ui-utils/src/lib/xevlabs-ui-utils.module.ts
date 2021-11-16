import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component'
import { TranslocoModule } from '@ngneat/transloco'
import { MaterialModule } from './material/material.module'
import { FlexLayoutModule } from '@angular/flex-layout'
import { ConfirmationDirective } from './core/directives/confirmation.directive'
import { FormControlPipe } from './core/pipes/form-control/form-control.pipe'
import { ReactiveFormsModule } from '@angular/forms'

@NgModule({
	imports: [
		CommonModule,
		TranslocoModule,
		MaterialModule,
		FlexLayoutModule,
        ReactiveFormsModule
	],
	declarations: [
		ConfirmationModalComponent,
		ConfirmationDirective,
        FormControlPipe
	],
	exports: [
		ConfirmationDirective,
        FormControlPipe
	]
})
export class XevlabsUiUtilsModule {
}
