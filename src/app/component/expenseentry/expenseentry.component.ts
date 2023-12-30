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
  showcontent: any = '';
  constructor(private githubService: GithubServiceService) { }





  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.githubService.fetchDataFromGitHub().subscribe(
      (response: any) => {
        this.content = atob(response.content); // Decode content from base64
        let contentfake = this.content.trim().split('GORAR@WS#P@R@TOR')
        contentfake.pop()
        contentfake.forEach((el: any) => {
          el.replace('Name:', '')
          let indexcut = el.indexOf(',') + 1
          let datecrindexcut = el.indexOf('Datecr:') - 1
          this.showcontent += `\n${el.substring(indexcut, datecrindexcut)}`
        })
        
      },
      error => {
        console.error('Error fetching data from GitHub:', error);
      }
    );
  }

  appendData() {

    if (this.user.trim() != '' || this.material.trim() != '' || this.materialgroup.trim() != '' || this.price.trim() != '' || this.accbalance.trim() != '' || this.inhandbalance.trim() != '' || this.offer.trim() != '' ||
      this.planned.trim() != '' || this.dateentry != '') {
      if (this.comment == '') this.comment = 'No comments'
      const currentDate = new Date();
      const formattedDateTime = `${currentDate.toDateString()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
      const formattedentryDateTime = `${this.dateentry.toDateString()}`;

      this.dateentry = this.dateentry.toLocaleString('en-US', { timeZone: 'UTC' });
      const newData = this.content + `Name:${this.user},Material:${this.material},Materialgroup:${this.materialgroup},Price:${this.price},Planned:${this.planned},Offer:${this.offer},AccountBalance:${this.accbalance},InhandBalance:${this.inhandbalance},Date:${formattedentryDateTime},Comment:${this.comment},Datecr:${formattedDateTime}GORAR@WS#P@R@TOR`;
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
