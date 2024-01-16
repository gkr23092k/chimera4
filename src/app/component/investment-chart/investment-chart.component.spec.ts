import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentChartComponent } from './investment-chart.component';

describe('InvestmentChartComponent', () => {
  let component: InvestmentChartComponent;
  let fixture: ComponentFixture<InvestmentChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvestmentChartComponent]
    });
    fixture = TestBed.createComponent(InvestmentChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
