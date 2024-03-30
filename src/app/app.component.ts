import { Component, inject } from '@angular/core';
import { FirebaseService } from './service/firebase.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'chimera';

  item: any;

  constructor(private dataService: FirebaseService) {
 
  }


}
