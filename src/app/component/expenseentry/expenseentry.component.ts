import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { GithubServiceService } from 'src/app/service/github-service.service';
import Swal from 'sweetalert2';
import * as _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-expenseentry',
  templateUrl: './expenseentry.component.html',
  styleUrls: ['./expenseentry.component.css']
})
export class ExpenseentryComponent implements OnInit {
  content: string = '';
  user: any = '';
  email: any = '';
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
  todaytotal: number = 0;
  last7DaysDatatotal: number = 0;
  last30DaysDatatotal: number = 0;
  investlast: any = [];
  secondchart: any = [];
  finallibiliity: any = [];
  endpiechartliable: any = []
  dataarrayobjliability: any;
  getsumcount: number = 0;
  givesumcount: number = 0;
  liablegettemp: any = [];
  liablegivetemp: any = [];
  dataarrayobjdropdown: any;
  materialdropdownliabillity: any;
  animal: any;
  addbalance: any;
  selectedData: any = null;
  favourities: any = [];
  isfavour: boolean = false;
  isswitch: boolean = false;
  constructor(private githubService: GithubServiceService, private router: Router, private spinner: NgxSpinnerService
    , public dialog: MatDialog) {

  }

  isselected(price: number): boolean {
    return this.selectedData && this.selectedData.Price === price;
  }

  selectData(refill: any, type: any) {
    this.selectedData = refill;
    console.log('Selected data:', this.selectedData);
    this.materialgroup = refill.Materialgroup
    this.material = refill.Material
    this.price = refill.Price.toString()
    this.calcbalance(type)
  }
  calcswitch(e: any) {
    let acb: any = 0
    let ihb: any = 0
    this.dataarrayobjholder.filter((bal: any) => {
      if (bal.Name == this.user) {
        this.userfiltered.push(bal)
        acb = bal.AccountBalance
        ihb = bal.InhandBalance
      }
    })
    console.log(e, this.offer, acb, ihb)
    if (this.offer == 'ACB') {
      ihb = parseInt(ihb) - parseInt(e)
      acb = parseInt(acb) + parseInt(e)
      this.accbalance = acb
      this.inhandbalance = ihb

    } else if (this.offer == 'IHB') {
      ihb = parseInt(ihb) + parseInt(e)
      acb = parseInt(acb) - parseInt(e)
      this.accbalance = acb
      this.inhandbalance = ihb

    }
  }
  cswitch() {
    this.materialgroup = 'switch'
    this.material = 'switch'
    this.price='0'
    this.isswitch = !this.isswitch
    this.offer = 'ACB'
  }

  ngOnInit() {
    this.spinner.show();
    this.user = localStorage.getItem('g0r@usern@mechimera');
    this.email = localStorage.getItem('g0r@usern@mechimeramail');

    this.searchusername = this.user
    // console.log(this.user, 'thislocalstorage')
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


    this.searchusername = localStorage.getItem('g0r@usern@mechimera')
    this.msg = localStorage.getItem('g0r@usern@mechimera')

    this.fetchData('YES');
    this.dateentry = new Date();
    this.githubService.invokeFirstComponentFunction.subscribe((name: string) => {
      // console.log('expense component')
    });

    this.githubService.changemessage(this.searchusername.replaceAll(',', '_').replaceAll(':', '_'))
    this.githubService.onFirstComponentButtonClick().then(() => {
      this.spinner.hide()
    })
    // this.githubService.currentvalue.subscribe((msg: any) => {
    //   console.log('msg', msg, 'expense')
    //   this.msg = msg
    //   if (msg != '') this.fetchData('YES')
    // })
    // if (this.searchusername != 'gora@2303') {
    //   if (this.user == null) {
    //     this.searchusername = 'no'
    //     this.networth = 0
    //   }
    //   this.searchuser()
    // }

  }


  onItemSelect(item: any) {
    console.log(item, 'item');
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  // notify(){
  //   Notification.
  // }


  fetchData(checkcase: any) {
    this.showcontent = ''
    this.materialdropdown = []
    this.dataarrayobj = []
    this.githubService.fetchDataFromGitHub().subscribe(
      (response: any) => {
        // console.log(this.content)
        this.content = atob(response.content); // Decode content from base64
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
        // console.log(this.dataarrayobj)

        this.favourities = []
        this.dataarrayobj.filter((el: any) => {
          if (el.Favourities == 'Yes') {
            this.favourities.push(el)
          }
        })
        if (checkcase === 'YES') {
          let tempstoreuser: any = []
          this.dataarrayobj.filter((el: any) => {
            // console.log(el)
            if (el.Materialgroup != 'Liability' && el.Liabilitystatus != 'Give' && el.Liabilitystatus != 'Get') {
              this.materialdropdown.push(el.Material.toUpperCase())
            }

            if (el.Name === this.msg) {
              tempstoreuser.push(el)

            }
          });
          if (tempstoreuser.length < 1) {
            this.dataarrayobj = [{ Name: this.msg, Mailid: '', Material: '', Materialgroup: '', Price: 0, Planned: 'Yes', Offer: 'No', AccountBalance: 0, InhandBalance: 0, Liabilitystatus: 'No', Date: 'Mon Jan 01 2024', Comment: 'No comments' }]
          }
          else {
            this.dataarrayobj = tempstoreuser

          }
        }
        // console.log(this.dataarrayobj)
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
        this.liablegettemp = []
        this.liablegivetemp = []
        this.dataarrayobjholder = []
        this.networth = 0
        const groupedByKeys = _.groupBy(this.dataarrayobj, 'Name');
        let resultObjectAcc: any = _.mapValues(groupedByKeys, group => _.last(group).AccountBalance);
        resultObjectAcc = _.values(resultObjectAcc);
        let resultObjectIhb: any = _.mapValues(groupedByKeys, group => _.last(group).InhandBalance);
        resultObjectIhb = _.values(resultObjectIhb);
        let accbalance = _.sum(resultObjectAcc);
        let ihbbalance = _.sum(resultObjectIhb);

        this.networth = accbalance + ihbbalance
        if (this.materialdropdown.length < 1) {
          this.dataarrayobj.forEach((el: any) => {
            if (el.Materialgroup != 'Liability' && el.Liabilitystatus != 'Give' && el.Liabilitystatus != 'Get') {
              this.materialdropdown.push(el.Material.toUpperCase())
            }
          })
        }
        this.dataarrayobjliability = this.dataarrayobj
        this.dataarrayobj.filter((el: any) => { if (el.Liabilitystatus == 'Get') this.liablegettemp.push(el) })
        this.liablegetval = _.sumBy(this.liablegettemp, 'Price');
        this.dataarrayobj.filter((el: any) => { if (el.Liabilitystatus == 'Give') this.liablegivetemp.push(el) })
        this.liablegiveval = _.sumBy(this.liablegivetemp, 'Price');

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
        this.dataarrayobj = this.dataarrayobj.filter((expense: any) => expense['Materialgroup'] !== 'Liability' &&expense['Materialgroup'] !== 'switch'&& expense['Materialgroup'] !== 'Investment'
          && expense['Liabilitystatus'] !== 'Get' && expense['Liabilitystatus'] !== 'Give');
        if (this.dataarrayobj.length == 0) {
          this.dataarrayobj = [{ "Price": "Nil" }]
        }
        // this.dataarrayobj.filter((expense: any) =>{
        // console.log(this.dataarrayobj)
        // })

        this.totalspent = _.sumBy(this.dataarrayobj, 'Price');
        this.highestofalltime = _.maxBy(this.dataarrayobj, 'Price')


        this.filterDataByDate(this.dataarrayobj, 1, this.resultArray);
        if (this.resultArray.length == 0) {
          this.resultArray = [{ "Price": "Nil" }]
        }
        this.todayData = _.maxBy(this.resultArray, 'Price')
        this.todaytotal = _.sumBy(this.resultArray, 'Price')


        this.filterDataByDate(this.dataarrayobj, 7, this.resultArray7);
        if (this.resultArray7.length == 0) {
          this.resultArray7 = [{ "Price": "Nil" }]
        }
        this.last7DaysData = _.maxBy(this.resultArray7, 'Price')
        this.last7DaysDatatotal = _.sumBy(this.resultArray7, 'Price')


        this.filterDataByDate(this.dataarrayobj, 30, this.resultArray30);
        if (this.resultArray30.length == 0) {
          this.resultArray30 = [{ "Price": "Nil" }]
        }
        this.last30DaysData = _.maxBy(this.resultArray30, 'Price')
        this.last30DaysDatatotal = _.sumBy(this.resultArray30, 'Price')


        // console.log(this.materialdropdown)

        let arraymateraildropdown = [...new Set(this.materialdropdown)];
        this.materialdropdown = []
        arraymateraildropdown.forEach((element: any, index: number) => {
          this.materialdropdown.push({ item_id: index, item_text: element })
        });
        this.materialdropdown = _.sortBy([...this.materialdropdown], 'item_text');
        this.liability()

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


  favo() {
    this.isfavour = !this.isfavour
  }

  calcbalance(val: any) {
    // console.log('called', val, this.price, this.user)
    if (this.price != 0 && this.price.trim() != '' && this.price.replaceAll('0', '') != ''
      && this.user != undefined && this.user.trim() != '') {
      // console.log('called', val, this.price, this.user)

      this.dataarrayobjholder.filter((bal: any) => {
        if (bal.Name == this.user) {
          // console.log(bal, this.user)
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
    // console.log(this.materialgroup)
    this.materialdropdown = []
    this.dataarrayobjholder.forEach((el: any) => {
      if (this.materialgroup != 'Liability' && el.Materialgroup != 'Get' && el.Materialgroup != 'Give' && el.Materialgroup != 'Credit') {
        if (el.Materialgroup != 'Liability') {
          this.materialdropdown.push(el.Material.toUpperCase())
        }
      }
      else if (this.materialgroup == 'Liability') {
        if (el.Materialgroup == 'Liability' || el.Materialgroup == 'Get' || el.Materialgroup == 'Give') {
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

    this.materialdropdown = _.sortBy([...this.materialdropdown], 'item_text');

    // console.log(this.materialdropdown, this.dataarrayobj)

  }


  appendData() {
    const result = this.containsSymbolsNumbersCharacters(this.user);
    // console.log(result);
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
      this.spinner.show()
      // this.fetchData('NO')
      this.githubService.changemessage(this.searchusername.replaceAll(',', '_').replaceAll(':', '_'))
      this.githubService.onFirstComponentButtonClick().then(() => {
        this.spinner.hide()
      })
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

    if (this.user.trim() != '' && this.email.trim() != '' && this.material != '' && this.materialgroup.trim() != '' &&
      this.price.trim() != '' && this.accbalance.toString().trim() != '' && this.inhandbalance.toString().trim() != '' && this.offer.trim() != '' &&
      this.planned.trim() != '' && this.dateentry != '') {
      this.user = this.user.replaceAll("'", '_').replaceAll(",", "_")
      // console.log(this.material, 'material')
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
          let newdata = `Name:${this.user},Mailid:${this.email},Material:${this.material},Materialgroup:${this.materialgroup},Price:${this.price},Favourities:${this.planned},Offer:${this.offer},AccountBalance:${this.accbalance},InhandBalance:${this.inhandbalance},Liabilitystatus:${this.liabilitystatus},Date:${formattedentryDateTime},Comment:${this.comment},Datecr:${formattedDateTime}GORAR@WS#P@R@TOR`;

          const newData = this.content + newdata
          this.githubService.fetchDataFromGitHub().subscribe(
            (response: any) => {
              const sha = response.sha;
              this.spinner.hide();
              // console.log(newdata)
              this.githubService.appendDataToGitHub(newData, sha).pipe(take(1)).subscribe(
                () => {
                  this.code = true

                  console.log('Data appended successfully!');

                  this.fetchData('YES');

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
                  this.router.navigate(['wait']);
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
  openDialog(): void {
    const dynamicheight = ((window.innerWidth < 768) ? 390 : 350)
    console.log(dynamicheight, 'dynamicheight', window.innerWidth, (window.innerWidth < 768) ? 390 : 350)
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { name: this.addbalance },
      height: dynamicheight + 'px',
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result !== undefined) {
        if (result.newaccbalance != undefined || result.newihbbalance != undefined) {
          if (parseInt(result.newaccbalance) > 0 || parseInt(result.newihbbalance) > 0) {
            if (result.newaccbalance == undefined) result.newaccbalance = '0'
            if (result.newihbbalance == undefined) result.newihbbalance = '0'
            this.addbalance = result;
            this.materialgroup = 'Liability'
            this.material = 'Credit'
            this.price = '0'
            this.comment = ((result.comment == '') ? 'No Comments' : result.comment)
            console.log(this.dataarrayobjholder)
            this.dataarrayobjholder.forEach((bal: any) => {
              if (this.user == bal.Name) {
                this.accbalance = bal.AccountBalance
                this.inhandbalance = bal.InhandBalance
              }
            });
            this.accbalance = parseInt(this.accbalance) + parseInt(result.newaccbalance)
            this.inhandbalance = parseInt(this.inhandbalance) + parseInt(result.newihbbalance)

            this.liabilitystatus = 'Credit'
            console.log(this.user.trim(), this.email.trim(), this.material, this.materialgroup.trim(),
              this.price.trim(), this.accbalance.toString().trim(), this.inhandbalance.toString().trim(), this.offer.trim(),
              this.planned.trim(), this.dateentry)
            this.appendincall('')
          }
        }
      }
    });
  }


  saveDataToLocal() {
    this.spinner.show()
    localStorage.setItem('g0r@usern@mechimera', (this.user));
    localStorage.setItem('g0r@usern@mechimeramail', (this.email));
    this.router.navigate(['wait'])
    setTimeout(() => {
      this.router.navigate(['chhk'])

    }, 1);
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
      title: 'User Added Successfully'
    })

    this.spinner.hide()

  }

  liability() {
    this.liableget = []
    this.liablegive = []
    this.investlast = []
    this.dataarrayobjliability.filter((el: any) => { if (el.Liabilitystatus == 'Give') this.liablegive.push(el) })
    const groupedByKeysliableget = _.groupBy(this.liableget, 'Name');
    const groupedByKeysliablegive = _.groupBy(this.liablegive, 'Name');
    let resultObjectget: any = _.mapValues(groupedByKeysliableget, group => _.last(group).Price);
    const resultObjectValueget: any = {
      ...resultObjectget,
      value: _.sum(Object.values(resultObjectget)),
      category: 'Get'

    };

    let resultObjectgive: any = _.mapValues(groupedByKeysliablegive, group => _.last(group).Price);
    const resultObjectValuegive: any = {
      ...resultObjectgive,
      value: _.sum(Object.values(resultObjectgive)),
      category: 'Give'
    };
    // console.log(resultObjectValueget,resultObjectValuegive)

    this.secondchart = [resultObjectValueget, resultObjectValuegive]
    // console.log('expenseliability', this.secondchart, resultObjectValueget)
    this.finallibiliity = this.dataarrayobjliability.filter((expense: any) => expense['Liabilitystatus'] == 'Give' || expense['Liabilitystatus'] == 'Get');
    this.dataarrayobjliability = this.dataarrayobjliability.filter((expense: any) => expense['Materialgroup'] == 'Investment' || expense['Materialgroup'] == 'Liability');
    this.dataarrayobjliability.filter((el: any) => {
      if (el.Materialgroup == 'Liability' && el.Liabilitystatus == 'Give') {
        el.Materialgroup = 'Give'
        el.Materialendname = el.Name + '*|*' + el.Material.toUpperCase() + '*|*' + el.Liabilitystatus
      }
      else if (el.Materialgroup == 'Liability' && el.Liabilitystatus == 'Get') {
        el.Materialgroup = 'Get'
        el.Materialendname = el.Name + '*|*' + el.Material.toUpperCase() + '*|*' + el.Liabilitystatus

      }
    })

    this.finallibiliity = Object.values(this.groupAndSum(this.finallibiliity, 'Materialendname', 'Price'))
    this.finallibiliity.forEach((l: any) => {
      if (l.Materialendname != undefined) {
        let splitter = l.Materialendname.split('*|*')
        l.name = splitter[0]
        l.material = splitter[1]
        l.materialnames = splitter[0] + splitter[1]
        l.materialstatus = splitter[2]
        l.Materialgroup = 'Liabillity ' + splitter[2]
      }
    })


    this.finallibiliity.forEach((overall: any) => {
      this.finallibiliity.forEach((give: any) => {
        if (give.materialnames == overall.materialnames && give.materialstatus != overall.materialstatus) {
          if (give.Price > overall.Price) {
            overall.final = give.Price - overall.Price
            overall.status = give.materialstatus

          }
          else if (give.Price < overall.Price && give.materialstatus != overall.materialstatus) {
            overall.final = overall.Price - give.Price
            overall.status = overall.materialstatus
          }
          else if (give.Price == overall.Price && give.materialstatus != overall.materialstatus) {
            overall.final = overall.Price - give.Price
            overall.status = 'Over'
          }
        }
      });
    });
    this.finallibiliity.forEach((overall: any) => {
      if (overall.status == undefined) {
        overall.status = overall.materialstatus
        overall.final = overall.Price

      }
      overall.category = overall.status
      overall.value = overall.Price
    })

    const uniqueData = _.uniqBy(_.reverse(this.finallibiliity), 'materialnames');
    let givedata = uniqueData.filter((expense: any) => expense['status'] == 'Give');
    let getdata = uniqueData.filter((expense: any) => expense['status'] == 'Get');
    // console.log(['c jhkjfd', givedata, uniqueData])
    this.getsumcount = _.sumBy(getdata, 'final')
    this.givesumcount = _.sumBy(givedata, 'final')




  }

  groupAndSum(array: any, groupByKey: any, sumByKey: any) {
    return array.reduce((result: any, item: any) => {
      const key = item[groupByKey];
      const value = item[sumByKey];

      if (!result[key]) {
        result[key] = { [groupByKey]: key, [sumByKey]: 0 };
      }

      result[key][sumByKey] += value;

      return result;
    }, {});
  }

  logout() {
    Swal.fire({
      title: "Are you sure?",
      text: "Log out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Logout"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Logout!",
          text: "Logged out Successfully",
          icon: "success"
        });
        this.githubService.authmessage(false)
        localStorage.removeItem('g0r@usern@mechimera');
        localStorage.removeItem('g0r@usern@mechimeramail');
        setTimeout(() => {
          this.router.navigate(['/login'])
        }, 100);
      }
    });
  }
}
