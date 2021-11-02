import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    exports: [
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatIconModule,
        MatProgressSpinnerModule
    ]
})
export class MaterialModule { }
