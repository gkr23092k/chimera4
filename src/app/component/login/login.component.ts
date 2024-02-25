import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GithubServiceService } from 'src/app/service/github-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: any = localStorage.getItem('g0r@usern@mechimeramail')
  password: any = localStorage.getItem('g0r@usern@mechimera')
  msg: any = ''
  dataarrayobj: any = [];
  ismallscreen: boolean = false

  constructor(private router: Router, private api: GithubServiceService, private fb: FormBuilder) { }
  response: any = []

  userform = this.fb.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: ['', Validators.required]
  });

  ngOnInit(): void {
    // console.log(this.email, this.password, 'oniti')




    let size = window.innerWidth
    if (size < 600) {
      this.ismallscreen = true
    }
    this.api.fetchDataFromGitHubuser().subscribe((res: any) => {
      // console.log(res)
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
      this.login('Start')
    })

  }

  login(key: string) {
    if (key != 'Start') {
      // console.log(this.email, this.password, this.response, this.msg, this.userform.value, this.email)
      this.email = this.userform.value.email
      this.password = this.userform.value.password
    }
    this.response.forEach((res: any) => {
      // console.log(this.email, this.password, 'u;g')

      if (res.Email.trim() == this.email && res.Password.trim() == this.password) {
        localStorage.setItem('g0r@usern@mechimeramail', this.email)
        localStorage.setItem('g0r@usern@mechimera', this.password)
        this.api.authmessage(true)
      }

    });
    this.msg = (key != 'Start') ? 'Incorrect Email or Password' : ''
    this.router.navigate(['entry']);

  }
}
