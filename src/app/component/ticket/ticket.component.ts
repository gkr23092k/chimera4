import {
  CdkDragDrop, moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GithubServiceService } from 'src/app/service/github-service.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent {
  data: any = ''
  description: string = '';
  descriptionfeature: string = ''
  dataarrayobj: any = [];
  content: string = '';
  user: any;
  email: any = '';
  code: boolean = false;
  constructor(private githubService: GithubServiceService, private router: Router, private spinner: NgxSpinnerService) { }
  ngOnInit(): void {
    this.spinner.show();
    this.user = localStorage.getItem('g0r@usern@mechimera');
    this.email = localStorage.getItem('g0r@usern@mechimeramail');
    this.fetchData('NO')
  }
  onOKClick(type: any) {
    this.appendData(type)
  }
  appendData(type: any) {
    console.log(this.user);
    let temp = this.description
    if (type == 'Feature') {
      temp = this.descriptionfeature
    }
    if (temp != '' && this.user) {
      this.description = this.description.replaceAll(',', '_')
      const currentDate = new Date();
      const formattedDateTime = `${currentDate.toDateString()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

      try {
        this.spinner.show();

        let newdata = `Name:${this.user},Description:${temp},Type:${type},Status:ActiveGORAR@WS#P@R@TOR`
        const newData = this.content + newdata
        this.githubService.fetchDataFromGitHubTicket().subscribe(
          (response: any) => {
            const sha = response.sha;
            this.spinner.hide();
            // console.log(newdata)
            this.githubService.appendDataToGitHubTicket(newData, sha).pipe().subscribe(
              () => {
                this.code = true

                console.log('Data appended successfully!');

                this.fetchData('NO');

                const Toast = Swal.mixin({
                  toast: true,
                  position: 'center',
                  showConfirmButton: false,
                  timer: 5000,
                  showCloseButton: true,
                  timerProgressBar: true,
                  didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                  }
                })

                Toast.fire({
                  icon: 'info',
                  title: 'Issue Raised Successfully'
                })
                this.router.navigate(['wait']);
                setTimeout(() => {
                  this.router.navigate(['issues']);

                }, 200);


              });
          },
          error => {
            console.error('Error fetching data from GitHub:', error);
          }
        );
      } catch (error) {
        const Toast = Swal.mixin({
          toast: true,
          position: 'center',
          showConfirmButton: false,
          timer: 10000,
          showCloseButton: true,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })

        Toast.fire({
          icon: 'info',
          title: 'Fill the Data Properly'
        })
      }

    } else {
      this.swaltoast('Fill the Description!')
    }
  }
  containsSymbolsNumbersCharacters(inputString: any) {
    const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    const containsSymbols = regex.test(inputString);

    // Check for numbers and characters
    const containsNumbersCharacters = /[0-9a-zA-Z]/.test(inputString);
    let containsNumbersCharacterslength = false
    if (inputString.length >= 5) {
      containsNumbersCharacterslength = true
    }
    return containsSymbols && containsNumbersCharacters && containsNumbersCharacterslength;
  }

  fetchData(checkcase: any) {

    this.dataarrayobj = []
    this.githubService.fetchDataFromGitHubTicket().subscribe(
      (response: any) => {
        this.content = atob(response.content); // Decode content from base64
        console.log(this.content)
        let contentfake = this.content.trim().split('GORAR@WS#P@R@TOR')
        contentfake.pop()
        contentfake.forEach((el: any) => {
          el.replace('Name:', '')
          // let indexcut = el.indexOf(',') + 1
          // let datecrindexcut = el.indexOf('Datecr:') - 1
          // let data = el.substring(indexcut, datecrindexcut)
          let objdata: any = el.trim().split(',');
          // this.showcontent += `\n${el}`

          const dataObject: any = {};

          objdata.forEach((pair: any) => {
            const [key, value] = pair.split(':');
            dataObject[key] = isNaN(value) ? (value != null && value != '') ? value.trim() : value : parseFloat(value);
          });
          this.dataarrayobj.push(dataObject)
        })
        console.log(this.dataarrayobj)

        this.dataarrayobj.forEach((element: any) => {
          element.Description=element.Description.toLowerCase()
          if (element.Status == 'Active' && element.Type == 'Fix') {
            this.todo.push(element.Description)
          } else if (element.Status == 'Done' && element.Type == 'Fix') {
            this.done.push(element.Description)

          } else if (element.Status == 'Progress' && element.Type == 'Fix') {
            this.progress.push(element.Description)

          }
          else if (element.Status == 'Active' && element.Type == 'Feature') {
            this.todofeature.push(element.Description)
          } else if (element.Status == 'Done' && element.Type == 'Feature') {
            this.donefeature.push(element.Description)

          } else if (element.Status == 'Progress' && element.Type == 'Feature') {
            this.progressfeature.push(element.Description)

          }

        });


      },
      error => {
        console.error('Error fetching data from GitHub:', error);
      }
    );
  }

  swaltoast(swaltitle: any) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'center',
      showConfirmButton: false,
      timer: 10000,
      showCloseButton: true,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: 'info',
      title: swaltitle
    })
  }


  public todo: any = [];
  public progress: any = [];
  public done: any = [];
  public todofeature: any = [];
  public progressfeature: any = [];
  public donefeature: any = [];


  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }


  dropfeature(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  backtohome(){
    // console.log('back')
    this.router.navigate(['entry'])
  }

}