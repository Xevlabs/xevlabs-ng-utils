import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleChipAutocompleteSelectorComponent } from './single-chip-autocomplete-selector.component';

describe('SingleChipAutocompleteSelectorComponent', () => {
    let component: SingleChipAutocompleteSelectorComponent;
    let fixture: ComponentFixture<SingleChipAutocompleteSelectorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SingleChipAutocompleteSelectorComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(
            SingleChipAutocompleteSelectorComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
