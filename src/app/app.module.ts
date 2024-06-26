import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

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
import { GridComponent } from './component/grid/grid.component';
import { AgGridModule } from 'ag-grid-angular';
import {MatCardModule} from '@angular/material/card';
import { LiabilityChartComponent } from './component/liability-chart/liability-chart.component';
import { InvestmentChartComponent } from './component/investment-chart/investment-chart.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BubbleComponent } from './component/bubble/bubble.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { DialogComponent } from './component/dialog/dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { TicketComponent } from './component/ticket/ticket.component';
import { DummyComponent } from './component/dummy/dummy.component';
import { StackedcolummnComponent } from './component/stackedcolummn/stackedcolummn.component';
import { LoginComponent } from './component/login/login.component';
import { AuthGuardService } from './guard/auth.guard';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import {getStorage,provideStorage } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire/compat';


import { firebaseConfig } from 'src/firebase.config';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

@NgModule({
  declarations: [
    AppComponent,
    ExpenseentryComponent,
    LineChartComponent,
    DonutChartComponent,
    NegativeLineChartComponent,
    DownfallChartComponent,
    GridComponent,
    LiabilityChartComponent,
    InvestmentChartComponent,
    BubbleComponent,
    DialogComponent,
    TicketComponent,
    DummyComponent,
    StackedcolummnComponent,
    LoginComponent
    
  ],
  imports: [
    BrowserModule,FormsModule,MatInputModule,MatFormFieldModule,HttpClientModule,MatNativeDateModule,MatCardModule,
    AppRoutingModule,BrowserAnimationsModule,MatSelectModule,MatButtonModule,MatDatepickerModule,AgGridModule,DragDropModule,
    MatChipsModule,NgxSpinnerModule,NgxMatSelectSearchModule,NgMultiSelectDropDownModule.forRoot(),MatDialogModule,
    ReactiveFormsModule,MatMenuModule,MatIconModule,
    AngularFireModule.initializeApp(firebaseConfig),
    provideFirestore(() => getFirestore()),
    provideStorage(()=>getStorage()),
    AngularFirestoreModule

  ],
  providers: [AuthGuardService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
