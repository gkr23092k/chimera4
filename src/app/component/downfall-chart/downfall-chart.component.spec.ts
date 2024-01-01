import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownfallChartComponent } from './downfall-chart.component';

describe('DownfallChartComponent', () => {
  let component: DownfallChartComponent;
  let fixture: ComponentFixture<DownfallChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DownfallChartComponent]
    });
    fixture = TestBed.createComponent(DownfallChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
