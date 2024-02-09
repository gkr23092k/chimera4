import { Component } from '@angular/core';
import { GithubServiceService } from 'src/app/service/github-service.service';
import * as _ from 'lodash';
import emailjs from '@emailjs/browser';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent {
  content: string = '';
  dataarrayobj: any = [];
  rowData: any = [];
  columnDefs: any = []
  msg: any = '';
  window: number = 0;
  intialwidth: number = 0;
  userverified: boolean = false;
  usergroup: any = []
  mailmsg: any = ''
  maildataarrayobj: any;
  startdate: any;
  enddate: any;
  admin: any = '';
  isadmin: boolean=false;
  constructor(private githubService: GithubServiceService, private spinner: NgxSpinnerService) { }
  ngOnInit() {
    this.admin = localStorage.getItem('g0r@usern@mechimera')
    if(this.admin=='gora@2303'){
      this.isadmin=true
    }
    this.startdate = new Date()
    this.startdate = new Date(this.startdate.getTime() - 86400000);
    this.enddate = new Date()

    this.userverified = false
    this.fetchData('NO');
    this.githubService.invokeFirstComponentFunction.subscribe((name: string) => {
      console.log('line chart component')
    });


    this.githubService.currentvalue.subscribe((msg: any) => {
      // console.log('msg', msg)
      this.msg = msg
      if (msg != '') this.githubService.invokeFirstComponentFunction.subscribe((name: string) => {
        console.log('line chart component')
      });

      this.githubService.currentvalue.subscribe((msg: any) => {
        console.log('msg', msg)
        this.msg = msg
        if (msg != '') this.fetchData('YES')
      })
    })
  }

  fetchData(checkcase: any) {
    this.githubService.fetchDataFromGitHub().subscribe(
      (response: any) => {
        this.content = atob(response.content); // Decode content from base64
        let contentfake = this.content.trim().split('GORAR@WS#P@R@TOR')
        this.dataarrayobj = []
        contentfake.pop()
        contentfake.forEach((el: any) => {
          el.replace('Name:', '')
          // let indexcut = el.indexOf(',') + 1
          // let datecrindexcut = el.indexOf('Datecr:') - 1
          // let data = el.substring(indexcut, datecrindexcut)
          let objdata: any = el.trim().split(',');
          const dataObject: any = {};
          objdata.forEach((pair: any) => {
            const [key, value] = pair.split(':');
            dataObject[key] = isNaN(value) ? value.trim() : parseFloat(value);
          });
          this.dataarrayobj.push(dataObject)
        })
        if (checkcase === 'YES') {
          let tempstoreuser: any = []
          this.dataarrayobj = _.sortBy(this.dataarrayobj, (item) => new Date(item.date));
          this.dataarrayobj.filter((el: any) => {
            // console.log(el)
            if (el.Name === this.msg) {
              tempstoreuser.push(el)
            }
          });
          this.dataarrayobj = tempstoreuser
        }
        this.dataarrayobj.filter((el: any, index: any) => {
          el.Id = index + 1
        });
        this.usergroup = _.uniqBy(this.dataarrayobj, 'Name');


        // console.log(this.usergroup)
        this.rowData = this.dataarrayobj

      },
      error => {
        console.error('Error fetching data from GitHub:', error);
      }
    );
    this.window = window.innerWidth;
    if (this.window < 767) {
      this.intialwidth = 150
    } else {
      this.intialwidth = 250
    }
    // console.log(this.window, 'scrreee')

    if (this.intialwidth != 0) {
      this.columnDefs = [
        { headerName: 'Id', field: 'Id', filter: true, initialWidth: 100, maxWidth: 300 },
        { headerName: 'Material', field: 'Material', filter: true, initialWidth: this.intialwidth, minWidth: 100, maxWidth: 300 },
        { headerName: 'Materialgroup', field: 'Materialgroup', filter: true, initialWidth: this.intialwidth - 30, minWidth: 100, maxWidth: 300 },
        { headerName: 'Price', field: 'Price', filter: true, initialWidth: 150, minWidth: 50, maxWidth: 300 },
        { headerName: 'AccBalance', field: 'AccountBalance', filter: true, initialWidth: 150, minWidth: 100, maxWidth: 300 },
        { headerName: 'IHBalance', field: 'InhandBalance', initialWidth: 150, filter: true, minWidth: 100, maxWidth: 300 },
        { headerName: 'Liablestatus', field: 'Liabilitystatus', filter: true, initialWidth: 150, minWidth: 150, maxWidth: 300 },
        { headerName: 'Date', field: 'Date', filter: true, initialWidth: 200, minWidth: this.intialwidth - 30, maxWidth: 300 },
        { headerName: 'Planned', field: 'Planned', filter: true, initialWidth: 150, minWidth: 100, maxWidth: 300 },
        { headerName: 'Offer', field: 'Offer', filter: true, initialWidth: 100, minWidth: 100, maxWidth: 300 },
        { headerName: 'Comment', field: 'Comment', filter: true, initialWidth: 150, minWidth: 150, maxWidth: 300 }
      ];
      let temprefresh = this.columnDefs
      this.columnDefs = []
      setTimeout(() => {
        this.columnDefs = temprefresh
      }, 10);
    }


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


  refreshgrid() {
    let temprefresh = this.columnDefs
    this.columnDefs = []
    setTimeout(() => {
      // console.log(this.msg)
      let localpin = localStorage.getItem('g0r@usern@mechimera');
      if ('gora@2303' == localpin && temprefresh[0].headerName != 'Name') {
        temprefresh = [{ headerName: 'Name', field: 'Name', filter: true, initialWidth: 120, maxWidth: 300 }, ...temprefresh]
      }

      this.columnDefs = temprefresh
    }, 10);

  }
  codeaccess() {
    this.userverified = true
    // console.log(this.userverified)

  }
  mail() {
    this.maildataarrayobj = []
    if (this.mailmsg != '' && this.mailmsg != undefined) {
      this.dataarrayobj.filter((el: any) => {
        if (el.Name == this.mailmsg.Name && new Date(el.Date) >= this.startdate && new Date(el.Date) <= this.enddate) {
          this.maildataarrayobj.push(el)
        }
      })
      // console.log(this.maildataarrayobj,this.startdate,this.enddate)

      let groupedData: any = Object.values(this.groupAndSum(this.maildataarrayobj, 'Materialgroup', 'Price'));
      groupedData = JSON.stringify(groupedData);
      groupedData = groupedData.replaceAll('","Price":', ' - ')
      groupedData = groupedData.replaceAll('{"Materialgroup":"', '')
      groupedData = groupedData.replaceAll('}', ' Rs \n')
      groupedData = groupedData.replaceAll(',', '')
      groupedData = groupedData.replaceAll('[', '').replaceAll(']', '')

      if (groupedData.trim() == '') {
        groupedData = `No Expense Added`
      }
      groupedData = `MaterialGroup Expense from 
      ${this.startdate.getFullYear()}-${(this.startdate.getMonth() + 1).toString().padStart(2, '0')}-${this.startdate.getDate().toString().padStart(2, '0')} To ${this.enddate.getFullYear()}-${(this.enddate.getMonth() + 1).toString().padStart(2, '0')}-${this.enddate.getDate().toString().padStart(2, '0')}\n\n` + groupedData
      // console.log(groupedData)
      const currentDate = new Date();
      const day = String(currentDate.getDate()).padStart(2, '0');
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const year = currentDate.getFullYear();
      const hours = String(currentDate.getHours()).padStart(2, '0');
      const minutes = String(currentDate.getMinutes()).padStart(2, '0');
      const seconds = String(currentDate.getSeconds()).padStart(2, '0');
      let formattedDate = `${day}|${month}|${year} ${hours}:${minutes}:${seconds}`;
      formattedDate = formattedDate.toString()
      // console.log(formattedDate);
      this.spinner.show()
      emailjs.init('yBLaVEdX0cbV52M97')
      emailjs.send("service_j58sl87", "template_wv8l4rj", {
        // to_name: "dhineshrevathi2210@gmail.com",
        to_name: this.mailmsg.Mailid,
        message: groupedData,
        currentdate: formattedDate,
      });
      setTimeout(() => {
        this.spinner.hide()
      }, 2000);
    }
    else {
      alert('fill user')
    }

  }

}
