import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { GithubServiceService } from 'src/app/service/github-service.service';
import Swal from 'sweetalert2';
import * as _ from 'lodash';


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
  calcaccbalance: any = '';
  inhandbalance: any = '';
  calcinhandbalance: any = '';
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
  code: boolean = false;
  highestofalltime: any = []
  last7DaysData: any = [];
  todayData: any = [];
  last30DaysData: any = [];
  resultArray: any = []
  resultArray7: any = []
  resultArray30: any = []
  dataarrayobjinvest: any = [];
  highestofalltimeinv: any = []
  last30DaysDatainv: any = [];
  last30Daysinv: any = [];
  totalinvest: any = []
  last7DaysDatainv: any = [];
  last7Daysinv: any = [];
  msg: any = '';
  last1DaysDatainv: any = [];
  last1Daysinv: any = []
  totalspent: number=0;

  constructor(private githubService: GithubServiceService, private router: Router) {

  }





  ngOnInit() {
    this.fetchData('NO');
    this.dateentry = new Date();
    this.githubService.invokeFirstComponentFunction.subscribe((name: string) => {
      console.log('expense component')
    });
    this.githubService.currentvalue.subscribe((msg: any) => {
      console.log('msg', msg, 'expense')
      this.msg = msg
      if (msg != '') this.fetchData('YES')
    })

  }

  fetchData(checkcase: any) {
    this.showcontent = ''
    this.materialdropdown = []
    this.githubService.fetchDataFromGitHub().subscribe(
      (response: any) => {
        this.content = atob(response.content); // Decode content from base64
        let contentfake = this.content.trim().split('GORAR@WS#P@R@TOR')
        contentfake.pop()
        contentfake.forEach((el: any) => {
          el.replace('Name:', '')
          // let indexcut = el.indexOf(',') + 1
          // let datecrindexcut = el.indexOf('Datecr:') - 1
          // let data = el.substring(indexcut, datecrindexcut)
          let objdata: any = el.trim().split(',');
          this.showcontent += `\n${el}`
          this.materialdropdown.push(el.split(',')[1].replace('Material:', '').toUpperCase())

          const dataObject: any = {};

          objdata.forEach((pair: any) => {
            const [key, value] = pair.split(':');
            dataObject[key] = isNaN(value) ? value.trim() : parseFloat(value);
          });
          this.dataarrayobj.push(dataObject)
        })
        if (checkcase === 'YES') {
          let tempstoreuser: any = []
          this.dataarrayobj.filter((el: any) => {
            console.log(el)
            if (el.Name === this.msg) {
              tempstoreuser.push(el)
            }
          });
          this.dataarrayobj = tempstoreuser
        }
        this.highestofalltime = []
        this.last7DaysData = [];
        this.todayData = [];
        this.last30DaysData = [];
        this.resultArray = []
        this.resultArray7 = []
        this.resultArray30 = []
        this.last30DaysDatainv = [];
        this.last30Daysinv = [];
        this.totalinvest = []
        this.last7DaysDatainv = [];
        this.last7Daysinv = [];
        this.last1DaysDatainv = []
        this.last1Daysinv = []
        this.totalspent=0
        this.dataarrayobjinvest = this.dataarrayobj.filter((expense: any) => expense['Materialgroup'] === 'Investment');
        if (this.dataarrayobjinvest.length == 0) {
          this.dataarrayobjinvest = [{ "Price": "Nil" }]
        }
        this.highestofalltimeinv = _.maxBy(this.dataarrayobjinvest, 'Price')

        this.filterDataByDate(this.dataarrayobjinvest, 1, this.last1DaysDatainv);
        // console.log(['resultArray', this.resultArray])
        if (this.last1DaysDatainv.length == 0) {
          this.last1DaysDatainv = [{ "Price": "Nil" }]
        }
        this.last1Daysinv = _.maxBy(this.last1DaysDatainv, 'Price')


        this.filterDataByDate(this.dataarrayobjinvest, 7, this.last7DaysDatainv);
        // console.log(['resultArray', this.resultArray])
        if (this.last7DaysDatainv.length == 0) {
          this.last7DaysDatainv = [{ "Price": "Nil" }]
        }
        this.last7Daysinv = _.maxBy(this.last7DaysDatainv, 'Price')


        this.filterDataByDate(this.dataarrayobjinvest, 30, this.last30DaysDatainv);
        // console.log(['resultArray', this.resultArray])
        if (this.last30DaysDatainv.length == 0) {
          this.last30DaysDatainv = [{ "Price": "Nil" }]
        }
        this.last30Daysinv = _.maxBy(this.last30DaysDatainv, 'Price')

        if (this.dataarrayobjinvest.length == 0) {
          this.dataarrayobjinvest = [{ "Price": 0 }]
        }
        this.totalinvest = _.sumBy(this.dataarrayobjinvest, 'Price');



        this.dataarrayobj = this.dataarrayobj.filter((expense: any) => expense['Materialgroup'] !== 'Liability' && expense['Materialgroup'] !== 'Investment');
        if (this.dataarrayobj.length == 0) {
          this.dataarrayobj = [{ "Price": "Nil" }]
        }
        this.totalspent = _.sumBy(this.dataarrayobj, 'Price');
        this.highestofalltime = _.maxBy(this.dataarrayobj, 'Price')


        this.filterDataByDate(this.dataarrayobj, 1, this.resultArray);
        if (this.resultArray.length == 0) {
          this.resultArray = [{ "Price": "Nil" }]
        }
        this.todayData = _.maxBy(this.resultArray, 'Price')


        this.filterDataByDate(this.dataarrayobj, 7, this.resultArray7);
        if (this.resultArray7.length == 0) {
          this.resultArray7 = [{ "Price": "Nil" }]
        }
        this.last7DaysData = _.maxBy(this.resultArray7, 'Price')


        this.filterDataByDate(this.dataarrayobj, 30, this.resultArray30);
        if (this.resultArray30.length == 0) {
          this.resultArray30 = [{ "Price": "Nil" }]
        }
        this.last30DaysData = _.maxBy(this.resultArray30, 'Price')



        this.materialdropdown = [...new Set(this.materialdropdown)];
      },
      error => {
        console.error('Error fetching data from GitHub:', error);
      }
    );
  }

  async filterDataByDate(data: any[], daysAgo: number, resultArray: any[]) {
    const currentDate = new Date();
    const startDate = new Date();
    startDate.setDate(currentDate.getDate() - daysAgo);

    data.forEach(item => {
      const itemDate = new Date(item.Date);
      if (itemDate >= startDate && itemDate <= currentDate) {
        resultArray.push(item);
      }
    });
  }


  calcbalance(val: any) {
    console.log('called', val, this.price, this.user)
    if (this.price != 0 && this.price.trim() != '' && this.price.replaceAll('0', '') != ''
      && this.user != undefined && this.user.trim() != '') {
      console.log('called', val, this.price, this.user)

      this.dataarrayobj.filter((bal: any) => {
        if (bal.Name == this.user) {
          console.log(bal, this.user)
          this.calcaccbalance = bal.AccountBalance
          this.calcinhandbalance = bal.InhandBalance
        }
      })
      if (val == 'ACC') {
        this.accbalance = this.calcaccbalance - this.price
        this.inhandbalance = this.calcinhandbalance

      }
      else if (val == 'IHB') {
        this.accbalance = this.calcaccbalance
        this.inhandbalance = this.calcinhandbalance - this.price
      }
      // console.log(this.accbalance, this.inhandbalance)
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
        title: 'Fill the User & Price Properly '
      })
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





  appendData() {
    const result = this.containsSymbolsNumbersCharacters(this.user);
    console.log(result);
    if (result) {

      if (this.user.trim() != '' && this.material.trim() != '' && this.materialgroup.trim() != '' &&
        this.price.trim() != '' && this.accbalance.toString().trim() != '' && this.inhandbalance.toString().trim() != '' && this.offer.trim() != '' &&
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
                this.githubService.appendDataToGitHub(newData, sha).pipe(take(1)).subscribe(
                  () => {
                    this.code = true
                    console.log('Data appended successfully!');

                    this.fetchData('NO');
                    Swal.fire({
                      title: "Success",
                      text: "Material Added Successfully",
                      icon: "success"
                    })
                    this.router.navigate(['ch']);
                    setTimeout(() => {
                      this.router.navigate(['entry']);
                      // const Toast = Swal.mixin({
                      //   toast: true,
                      //   position: 'center',
                      //   showConfirmButton: false,
                      //   timer: 10000,
                      //   showCloseButton: true,
                      //   timerProgressBar: true,
                      //   didOpen: (toast) => {
                      //     toast.addEventListener('mouseenter', Swal.stopTimer)
                      //     toast.addEventListener('mouseleave', Swal.resumeTimer)
                      //   }
                      // })

                      // Toast.fire({
                      //   icon: 'info',
                      //   title: 'Fill the Date Properly'
                      // })
                    }, 800);


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
        title: 'Username should have characters, numbers, symbols and minimum 5 digits'
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
    else {
      this.githubService.changemessage(this.searchusername.replaceAll(',', '_').replaceAll(':', '_'))
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
