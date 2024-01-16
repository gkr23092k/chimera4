import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilityChartComponent } from './liability-chart.component';

describe('LiabilityChartComponent', () => {
  let component: LiabilityChartComponent;
  let fixture: ComponentFixture<LiabilityChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LiabilityChartComponent]
    });
    fixture = TestBed.createComponent(LiabilityChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
