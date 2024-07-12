import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleChipsAutocompleteSelectorComponent } from './multiple-chips-autocomplete-selector.component';

describe('MultipleChipsAutocompleteSelectorComponent', () => {
    let component: MultipleChipsAutocompleteSelectorComponent;
    let fixture: ComponentFixture<MultipleChipsAutocompleteSelectorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MultipleChipsAutocompleteSelectorComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(
            MultipleChipsAutocompleteSelectorComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
