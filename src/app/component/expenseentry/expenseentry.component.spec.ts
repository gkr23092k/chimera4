import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseentryComponent } from './expenseentry.component';

describe('ExpenseentryComponent', () => {
  let component: ExpenseentryComponent;
  let fixture: ComponentFixture<ExpenseentryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpenseentryComponent]
    });
    fixture = TestBed.createComponent(ExpenseentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
