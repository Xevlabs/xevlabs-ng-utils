import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoCompleteWrapperComponent } from './auto-complete-wrapper.component';

describe('AutoCompleteWrapperComponent', () => {
  let component: AutoCompleteWrapperComponent;
  let fixture: ComponentFixture<AutoCompleteWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoCompleteWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoCompleteWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
