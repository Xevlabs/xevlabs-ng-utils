import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component'
import { TranslocoModule } from '@ngneat/transloco'
import { MaterialModule } from './material/material.module'
import { FlexLayoutModule } from '@angular/flex-layout'
import { ConfirmationDirective } from './core/directives/confirmation.directive'
import { FormControlPipe } from './core/pipes/form-control/form-control.pipe'
import { ReactiveFormsModule } from '@angular/forms'
import { FlagEmojiPipe } from './core/pipes/flag-emoji/flag-emoji.pipe'
import { PhoneNumberInputComponent } from './components/phone-number-input/phone-number-input.component';
import { CommentControlComponent } from './components/comment-control/comment-control.component'

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
        FormControlPipe,
        PhoneNumberInputComponent,
        FlagEmojiPipe,
        CommentControlComponent,
    ],
    exports: [
        ConfirmationDirective,
        FormControlPipe,
        PhoneNumberInputComponent,
        FlagEmojiPipe,
        CommentControlComponent,
    ]
})
export class XevlabsUiUtilsModule {
}
