import { Component, OnInit } from '@angular/core';
import { GithubServiceService } from 'src/app/service/github-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-expenseentry',
  templateUrl: './expenseentry.component.html',
  styleUrls: ['./expenseentry.component.css']
})
export class ExpenseentryComponent implements OnInit {
  content: string = '';
  user: any = '';
  material: any = '';
  materialgroup: any = '';
  price: any = '';
  accbalance: any = '';
  inhandbalance: any = '';
  offer: any = '';
  planned: any = '';
  dateentry: any = '';
  comment: any = '';
  constructor(private githubService: GithubServiceService) { }





  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.githubService.fetchDataFromGitHub().subscribe(
      (response: any) => {
        this.content = atob(response.content); // Decode content from base64
      },
      error => {
        console.error('Error fetching data from GitHub:', error);
      }
    );
  }

  appendData() {

    if (this.user.trim() != '' || this.material.trim() != '' || this.materialgroup.trim() != '' || this.price.trim() != '' || this.accbalance.trim() != '' || this.inhandbalance.trim() != '' || this.offer.trim() != '' ||
      this.planned.trim() != '' || this.dateentry != '') {
      const currentDate = new Date().toLocaleString('en-US', { timeZone: 'UTC' });
      console.log('Current Date and Time (UTC):', currentDate);
      const newData = `Name:${this.user},Material:${this.material},Materialgroup:${this.materialgroup},Price:${this.price},Planned:${this.planned},Offer:${this.offer},AccountBalance:${this.accbalance},InhandBalance:${this.inhandbalance},Date:${this.dateentry},Comment:${this.comment},Datecr:${currentDate}`;
      this.githubService.fetchDataFromGitHub().subscribe(
        (response: any) => {
          const sha = response.sha;
          this.githubService.appendDataToGitHub(newData, sha).subscribe(
            () => {
              console.log('Data appended successfully!');
              this.fetchData(); // Fetch updated content
            },
            error => {
              console.error('Error appending data to GitHub:', error);
            }
          );
        },
        error => {
          console.error('Error fetching data from GitHub:', error);
        }
      );
    } else {
      const Toast = Swal.mixin({
        toast: true,
        position: 'center',
        showConfirmButton: false,
        timer: 15000,
        showCloseButton: true,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })

      Toast.fire({
        icon: 'info',
        title: 'Fill all the Details Properly'
      })
    }

  }
}
