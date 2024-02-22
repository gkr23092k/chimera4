import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedcolummnComponent } from './stackedcolummn.component';

describe('StackedcolummnComponent', () => {
  let component: StackedcolummnComponent;
  let fixture: ComponentFixture<StackedcolummnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StackedcolummnComponent]
    });
    fixture = TestBed.createComponent(StackedcolummnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
