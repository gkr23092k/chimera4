import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseentryComponent } from './component/expenseentry/expenseentry.component';
import { DonutChartComponent } from './component/donut-chart/donut-chart.component';
import { BubbleComponent } from './component/bubble/bubble.component';
import { TicketComponent } from './component/ticket/ticket.component';
import { DummyComponent } from './component/dummy/dummy.component';
import { StackedcolummnComponent } from './component/stackedcolummn/stackedcolummn.component';
import {AuthGuardService} from './guard/auth.guard';
import { LoginComponent } from './component/login/login.component';

const routes: Routes = [
  { path: 'entry', component: ExpenseentryComponent ,canActivate:[AuthGuardService]},
  { path: 'ch', component: DonutChartComponent },
  { path: 'b', component: BubbleComponent},
  { path: 'issues', component: TicketComponent },
  { path: 'wait', component: DummyComponent },
  { path: 'w', component: StackedcolummnComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
