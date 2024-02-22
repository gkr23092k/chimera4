import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GithubServiceService } from 'src/app/service/github-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: any = 'test@gmail.com'
  password: any = 'Gora@2303'
  msg: any = ''
  dataarrayobj: any=[];
  constructor(private router: Router, private api: GithubServiceService) { }
  response: any = []
  ngOnInit(): void {
    this.api.fetchDataFromGitHubuser().subscribe((res: any) => {
      console.log(res)
      let content = atob(res.content); // Decode content from base64
      let contentfake = content.trim().split('GORAR@WS#P@R@TOR')
      contentfake.pop()
      contentfake.forEach((el: any) => {
        el.replace('Name:', '')
        contentfake.forEach((el: any) => {
          el.replace('Name:', '')
          let objdata: any = el.trim().split(',');

          const dataObject: any = {};

          objdata.forEach((pair: any) => {
            const [key, value] = pair.split(':');
            dataObject[key] = isNaN(value) ? (value != null && value != '') ? value.trim() : value : parseFloat(value);
          });
          this.response.push(dataObject)
        })
      })
    })
  }

  login() {
    console.log(this.email, this.password,this.response)
    localStorage.setItem('g0r@usern@mechimeramail', this.email)
    localStorage.setItem('g0r@usern@mechimera', this.password)
    this.response.forEach((res: any) => {
      if (res.Email.trim() == this.email && res.Password.trim() == this.password) {
        this.api.authmessage(true)
      }
    });
    this.router.navigate(['entry']);
    this.msg = 'Incorrect Email or Password'

  }
}
