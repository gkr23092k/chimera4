import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NegativeLineChartComponent } from './negative-line-chart.component';

describe('NegativeLineChartComponent', () => {
  let component: NegativeLineChartComponent;
  let fixture: ComponentFixture<NegativeLineChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NegativeLineChartComponent]
    });
    fixture = TestBed.createComponent(NegativeLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
