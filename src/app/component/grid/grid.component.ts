import { Component } from '@angular/core';
import { GithubServiceService } from 'src/app/service/github-service.service';
import * as _ from 'lodash';

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
  msg: any;

  constructor(private githubService: GithubServiceService) { }
  ngOnInit() {
    this.fetchData('NO');
    this.githubService.invokeFirstComponentFunction.subscribe((name: string) => {
      console.log('line chart component')
    });

    this.githubService.currentvalue.subscribe((msg: any) => {
      console.log('msg', msg)
      this.msg = msg
      if (msg != '')  this.githubService.invokeFirstComponentFunction.subscribe((name: string) => {
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
        this.dataarrayobj=[]
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
            console.log(el)
            if (el.Name === this.msg) {
              tempstoreuser.push(el)
            }
          });
          this.dataarrayobj = tempstoreuser
        }
        this.dataarrayobj.filter((el: any,index:any) => {
            el.Id=index+1
          
        });
        console.log([this.dataarrayobj, 'this.dataarrayobj'])
        this.rowData = this.dataarrayobj
      },
      error => {
        console.error('Error fetching data from GitHub:', error);
      }
    );

    this.columnDefs = [
      { headerName: 'Id', field: 'Id', filter: true, minWidth:10,maxWidth:300 },
      { headerName: 'Material', field: 'Material', filter: true, minWidth:100, maxWidth:300 },
      { headerName: 'Materialgroup', field: 'Materialgroup', filter: true, minWidth:100 ,maxWidth:300 },
      { headerName: 'Price', field: 'Price', filter: true, minWidth:50 ,maxWidth:300 },
      { headerName: 'AccountBalance', field: 'AccountBalance', filter: true, minWidth:100 ,maxWidth:300 },
      { headerName: 'InhandBalance', field: 'InhandBalance', filter: true, minWidth:100 ,maxWidth:300 },
      { headerName: 'Date', field: 'Date', filter: true, minWidth:100 ,maxWidth:300 },
      { headerName: 'Planned', field: 'Planned', filter: true, minWidth:100 ,maxWidth:300 },
      { headerName: 'Offer', field: 'Offer', filter: true, minWidth:100 ,maxWidth:300 }

    ];


  }
}
