import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoCompleteSelectorComponent } from './auto-complete-selector.component';

describe('AutoCompleteSelectorComponent', () => {
  let component: AutoCompleteSelectorComponent;
  let fixture: ComponentFixture<AutoCompleteSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoCompleteSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoCompleteSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
