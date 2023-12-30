import { Component, OnInit } from '@angular/core';
import { GithubServiceService } from 'src/app/service/github-service.service';

@Component({
  selector: 'app-expenseentry',
  templateUrl: './expenseentry.component.html',
  styleUrls: ['./expenseentry.component.css']
})
export class ExpenseentryComponent implements OnInit {
  content: string='';

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
    const newData = this.content +'\nNew data to append';
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
  }
}
