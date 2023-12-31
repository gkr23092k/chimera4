import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  offer: any = 'No';
  planned: any = 'No';
  dateentry: any = '';
  comment: any = '';
  showcontent: any = '';
  materialdropdown: any = []
  selectedChip: string | null = 'New Material';
  ismaterialdropdown: boolean = false;
  dataarrayobj: any = []
  searchusername: any = '';

  constructor(private githubService: GithubServiceService, private router: Router) { }





  ngOnInit() {
    this.fetchData();
    this.dateentry = new Date();
  }

  fetchData() {
    this.showcontent = ''
    this.materialdropdown = []
    this.githubService.fetchDataFromGitHub().subscribe(
      (response: any) => {
        this.content = atob(response.content); // Decode content from base64
        let contentfake = this.content.trim().split('GORAR@WS#P@R@TOR')
        contentfake.pop()
        contentfake.forEach((el: any) => {
          el.replace('Name:', '')
          let indexcut = el.indexOf(',') + 1
          let datecrindexcut = el.indexOf('Datecr:') - 1
          let data = el.substring(indexcut, datecrindexcut)
          let objdata: any = data.split(',');
          this.showcontent += `\n${data}`
          this.materialdropdown.push(data.split(',')[0].replace('Material:', '').toUpperCase())

          const dataObject: any = {};

          objdata.forEach((pair: any) => {
            const [key, value] = pair.split(':');
            dataObject[key] = isNaN(value) ? value.trim() : parseFloat(value);
          });
          this.dataarrayobj.push(dataObject)
        })
        this.materialdropdown = [...new Set(this.materialdropdown)];
        console.log(this.dataarrayobj)
      },
      error => {
        console.error('Error fetching data from GitHub:', error);
      }
    );
  }

  appendData() {

    if (this.user.trim() != '' && this.material.trim() != '' && this.materialgroup.trim() != '' &&
      this.price.trim() != '' && this.accbalance.trim() != '' && this.inhandbalance.trim() != '' && this.offer.trim() != '' &&
      this.planned.trim() != '' && this.dateentry != '') {
      this.user = this.user.replaceAll("'", '_').replaceAll(",", "_")
      this.material = this.material.replaceAll(",", "_").replaceAll("'", '_')
      if (/^[a-zA-Z]/.test(this.material) === true) {
        if (this.comment == '') this.comment = 'No comments'
        const currentDate = new Date();
        const formattedDateTime = `${currentDate.toDateString()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

        try {
          const formattedentryDateTime = `${this.dateentry.toDateString()}`;
          // this.dateentry = this.dateentry.toLocaleString('en-US', { timeZone: 'UTC' });
          const newData = this.content + `Name:${this.user},Material:${this.material},Materialgroup:${this.materialgroup},Price:${this.price},Planned:${this.planned},Offer:${this.offer},AccountBalance:${this.accbalance},InhandBalance:${this.inhandbalance},Date:${formattedentryDateTime},Comment:${this.comment},Datecr:${formattedDateTime}GORAR@WS#P@R@TOR`;
          this.githubService.fetchDataFromGitHub().subscribe(
            (response: any) => {
              const sha = response.sha;
              this.githubService.appendDataToGitHub(newData, sha).subscribe(
                () => {
                  console.log('Data appended successfully!');
                  Swal.fire({
                    title: "Success",
                    text: "Material Added Successfully",
                    icon: "success"
                  });
                  this.fetchData();
                  this.router.navigateByUrl('/entry', { skipLocationChange: true }).then(() => {
                    this.router.navigate(['entry']);
                  });
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
        } catch (error) {
          const Toast = Swal.mixin({
            toast: true,
            position: 'center',
            showConfirmButton: false,
            timer: 13000,
            showCloseButton: true,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })

          Toast.fire({
            icon: 'info',
            title: 'Fill the Date Properly'
          })
        }
      } else {
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
          title: 'Fill the Material with Characters'
        })
      }
    } else {
      const Toast = Swal.mixin({
        toast: true,
        position: 'center',
        showConfirmButton: false,
        timer: 13000,
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
  searchuser() {
    if (this.searchusername.trim() == '') {
      const Toast = Swal.mixin({
        toast: true,
        position: 'center',
        showConfirmButton: false,
        timer: 13000,
        showCloseButton: true,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })

      Toast.fire({
        icon: 'info',
        title: 'Fill the User name filter!'
      })

    }
    else{
    this.githubService.changemessage(this.searchusername)
    this.githubService.onFirstComponentButtonClick()
    }
  }


  chipSelectionChange(event: any) {
    if (event.source.selected) {
      // console.log('Selected:', event.source.value);
      this.selectedChip = event.source.value;
      this.ismaterialdropdown = this.selectedChip === 'Existing Material';
    } else {
      // console.log('Deselected:', event.source.value);
      // If 'Existing Material' is deselected, automatically select 'New Material'
      if (event.source.value === 'Existing Material') {
        this.selectedChip = 'New Material';
      } else if (event.source.value === 'New Material') {
        // If 'New Material' is deselected, automatically select 'Existing Material'
        this.selectedChip = 'Existing Material';
      } else {
        this.selectedChip = null;
      }
      // Update the dropdown flag based on the selected chip
      this.ismaterialdropdown = this.selectedChip === 'Existing Material';
    }
  }


}
