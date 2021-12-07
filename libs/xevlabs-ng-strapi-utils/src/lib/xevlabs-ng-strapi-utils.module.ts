import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCompleteSelectorComponent } from './components/auto-complete-selector/auto-complete-selector.component';
import { TranslocoModule } from '@ngneat/transloco';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './material/material.module';
import { CardListComponent } from './components/card-list/card-list.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MaterialModule,
        TranslocoModule
    ],
    declarations: [
        AutoCompleteSelectorComponent,
        CardListComponent,
    ],
    exports: [
        AutoCompleteSelectorComponent,
        CardListComponent,
    ]
})
export class XevlabsNgStrapiUtilsModule { }
