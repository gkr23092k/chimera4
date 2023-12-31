import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseentryComponent } from './component/expenseentry/expenseentry.component';
import { DonutChartComponent } from './component/donut-chart/donut-chart.component';

const routes: Routes = [
  { path: 'entry', component: ExpenseentryComponent },
  { path: 'ch', component: DonutChartComponent },

  { path: '**', component: ExpenseentryComponent },
  { path: '', redirectTo: 'entry', pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
