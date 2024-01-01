import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExpenseentryComponent } from './component/expenseentry/expenseentry.component';
import {MatSelectModule} from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatChipsModule} from '@angular/material/chips';
import { LineChartComponent } from './component/line-chart/line-chart.component';
import { DonutChartComponent } from './component/donut-chart/donut-chart.component';
import { NegativeLineChartComponent } from './component/negative-line-chart/negative-line-chart.component';
import { DownfallChartComponent } from './component/downfall-chart/downfall-chart.component';
@NgModule({
  declarations: [
    AppComponent,
    ExpenseentryComponent,
    LineChartComponent,
    DonutChartComponent,
    NegativeLineChartComponent,
    DownfallChartComponent
  ],
  imports: [
    BrowserModule,FormsModule,MatInputModule,MatFormFieldModule,HttpClientModule,MatNativeDateModule,
    AppRoutingModule,BrowserAnimationsModule,MatSelectModule,MatButtonModule,MatDatepickerModule,
    MatChipsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
