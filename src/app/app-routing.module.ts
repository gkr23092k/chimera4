import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseentryComponent } from './component/expenseentry/expenseentry.component';

const routes: Routes = [
  { path: 'entry', component: ExpenseentryComponent },
  { path: '**', component: ExpenseentryComponent },
  { path: '', redirectTo: 'entry', pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
