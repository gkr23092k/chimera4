import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { GithubServiceService } from 'src/app/service/github-service.service';
import Swal from 'sweetalert2';
import * as _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';


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
  totalspent: number = 0;
  networth: number = 0
  userfiltered: any = [];
  liabilitystatus: any = 'No';
  liableget: any = [];
  liablegive: any = [];
  liablegetval: number = 0;
  liablegiveval: number = 0;
  dataarrayobjholder: any = [];
  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: any = {};
  constructor(private githubService: GithubServiceService, private router: Router, private spinner: NgxSpinnerService) {

  }





  ngOnInit() {
    this.spinner.show();
    this.user = localStorage.getItem('g0r@usern@mechimera');
    this.searchusername=this.user
    console.log(this.user, 'thislocalstorage')
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      closeDropDownOnSelection: true
    };



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


  onItemSelect(item: any) {
    console.log(item, 'item');
  }
  onSelectAll(items: any) {
    console.log(items);
  }



  fetchData(checkcase: any) {
    this.showcontent = ''
    this.materialdropdown = []
    this.dataarrayobj=[]
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
              this.materialdropdown.push(el.Material.toUpperCase())

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
        this.totalspent = 0
        this.liableget = []
        this.liablegive = []
        this.dataarrayobjholder = []
        const groupedByKeys = _.groupBy(this.dataarrayobj, 'Name');
        let resultObjectAcc: any = _.mapValues(groupedByKeys, group => _.last(group).AccountBalance);
        resultObjectAcc = _.values(resultObjectAcc);
        let resultObjectIhb: any = _.mapValues(groupedByKeys, group => _.last(group).InhandBalance);
        resultObjectIhb = _.values(resultObjectIhb);
        let accbalance = _.sum(resultObjectAcc);
        let ihbbalance = _.sum(resultObjectIhb);


        this.networth = accbalance + ihbbalance

        this.dataarrayobj.forEach((el: any) => {
          if (el.Materialgroup != 'Liability') {
            this.materialdropdown.push(el.Material.toUpperCase())
          }
        })
        this.dataarrayobj.filter((el: any) => { if (el.Liabilitystatus == 'Get') this.liableget.push(el) })
        this.liablegetval = _.sumBy(this.liableget, 'Price');
        this.dataarrayobj.filter((el: any) => { if (el.Liabilitystatus == 'Give') this.liablegive.push(el) })
        this.liablegiveval = _.sumBy(this.liablegive, 'Price');

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


        this.dataarrayobjholder = this.dataarrayobj
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



        let arraymateraildropdown = [...new Set(this.materialdropdown)];
        this.materialdropdown = []
        arraymateraildropdown.forEach((element: any, index: number) => {
          this.materialdropdown.push({ item_id: index, item_text: element },
          )
        });
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

      this.dataarrayobjholder.filter((bal: any) => {
        if (bal.Name == this.user) {
          console.log(bal, this.user)
          this.userfiltered.push(bal)
          this.calcaccbalance = bal.AccountBalance
          this.calcinhandbalance = bal.InhandBalance
        }
      })

      if (val == 'ACC' && this.materialgroup != 'Liability') {
        this.accbalance = this.calcaccbalance - this.price
        this.inhandbalance = this.calcinhandbalance

      }
      else if (val == 'IHB' && this.materialgroup != 'Liability') {
        this.accbalance = this.calcaccbalance
        this.inhandbalance = this.calcinhandbalance - this.price
      }
      else if (val == 'ACC' && this.materialgroup == 'Liability' && this.liabilitystatus == 'Get') {
        this.accbalance = parseInt(this.calcaccbalance) + parseInt(this.price)
        this.inhandbalance = this.calcinhandbalance
      }
      else if (val == 'ACC' && this.materialgroup == 'Liability' && this.liabilitystatus == 'Give') {
        this.accbalance = this.calcaccbalance - this.price
        this.inhandbalance = this.calcinhandbalance
      }
      else if (val == 'IHB' && this.materialgroup == 'Liability' && this.liabilitystatus == 'Get') {
        this.accbalance = this.calcaccbalance
        this.inhandbalance = parseInt(this.calcinhandbalance) + parseInt(this.price)
      }
      else if (val == 'IHB' && this.materialgroup == 'Liability' && this.liabilitystatus == 'Give') {
        this.accbalance = this.calcaccbalance
        this.inhandbalance = this.calcinhandbalance - this.price
      }
      else {
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
          title: 'Select the Liability Status'
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
  onInputChange() {
    console.log(this.materialgroup)
    this.materialdropdown = []
    this.dataarrayobjholder.forEach((el: any) => {
      if (this.materialgroup != 'Liability') {
        if (el.Materialgroup != 'Liability') {
          this.materialdropdown.push(el.Material.toUpperCase())
        }
      }
      else if (this.materialgroup == 'Liability') {
        if (el.Materialgroup == 'Liability') {
          this.materialdropdown.push(el.Material.toUpperCase())
        }
      }
    })
    let arrmateraildropdown = [...new Set(this.materialdropdown)];
    this.materialdropdown = []
    arrmateraildropdown.forEach((element: any, index: number) => {
      this.materialdropdown.push({ item_id: index, item_text: element },
      )
    });

    console.log(this.materialdropdown, this.dataarrayobj)

  }


  appendData() {
    const result = this.containsSymbolsNumbersCharacters(this.user);
    console.log(result);
    if (result) {
      if (this.materialgroup == 'Liability') {
        if (this.liabilitystatus != 'No') {
          this.appendincall(result)
        }
        else {
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
        this.appendincall(result)
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
    this.material = ''
  }

  appendincall(result: any) {

    if (this.user.trim() != '' && this.material != '' && this.materialgroup.trim() != '' &&
      this.price.trim() != '' && this.accbalance.toString().trim() != '' && this.inhandbalance.toString().trim() != '' && this.offer.trim() != '' &&
      this.planned.trim() != '' && this.dateentry != '') {
      this.user = this.user.replaceAll("'", '_').replaceAll(",", "_")
      console.log(this.material, 'material')
      if (typeof this.material == 'object')
        this.material = this.material[0].item_text.replaceAll(",", "_").replaceAll("'", '_')
      else {
        this.material = this.material.replaceAll(",", "_").replaceAll("'", '_')

      }
      if (/^[a-zA-Z]/.test(this.material) === true) {
        if (this.comment == '') this.comment = 'No comments'
        const currentDate = new Date();
        const formattedDateTime = `${currentDate.toDateString()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

        try {
          this.spinner.show();

          const formattedentryDateTime = `${this.dateentry.toDateString()}`;
          // this.dateentry = this.dateentry.toLocaleString('en-US', { timeZone: 'UTC' });
          const newData = this.content + `Name:${this.user},Material:${this.material},Materialgroup:${this.materialgroup},Price:${this.price},Planned:${this.planned},Offer:${this.offer},AccountBalance:${this.accbalance},InhandBalance:${this.inhandbalance},Liabilitystatus:${this.liabilitystatus},Date:${formattedentryDateTime},Comment:${this.comment},Datecr:${formattedDateTime}GORAR@WS#P@R@TOR`;
          this.githubService.fetchDataFromGitHub().subscribe(
            (response: any) => {
              const sha = response.sha;
              this.spinner.hide();

              this.githubService.appendDataToGitHub(newData, sha).pipe(take(1)).subscribe(
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
                    title: 'Material Added Successfully'
                  })
                  this.router.navigate(['ch']);
                  this.msg = ''
                  setTimeout(() => {
                    this.router.navigate(['entry']);

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
  saveDataToLocal() {
    localStorage.setItem('g0r@usern@mechimera', (this.user));
  }
}
