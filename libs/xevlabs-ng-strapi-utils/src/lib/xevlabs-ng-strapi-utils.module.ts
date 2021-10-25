import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCompleteSelectorComponent } from './components/auto-complete-selector/auto-complete-selector.component';
import { TranslocoModule } from '@ngneat/transloco';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './material/material.module';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MaterialModule,
        TranslocoModule
    ],
    declarations: [
        AutoCompleteSelectorComponent
    ],
})
export class XevlabsNgStrapiUtilsModule { }
