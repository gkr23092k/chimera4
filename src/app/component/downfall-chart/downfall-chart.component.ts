import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { GithubServiceService } from 'src/app/service/github-service.service';
import * as _ from 'lodash';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
am4core.useTheme(am4themes_animated);
@Component({
  selector: 'app-downfall-chart',
  templateUrl: './downfall-chart.component.html',
  styleUrls: ['./downfall-chart.component.css']
})
export class DownfallChartComponent implements OnInit {

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

  constructor(private githubService: GithubServiceService, private router: Router) { }
  private chart!: am4charts.XYChart;

  msg: any = '';
  ngOnInit() {
    this.fetchData('NO');

    this.githubService.invokeFirstComponentFunction.subscribe((name: string) => {
      // console.log('line chart component')
    });

    this.githubService.currentvalue.subscribe((msg: any) => {
      // console.log('msg', msg)
      this.msg = msg
      // this.disposeChart()
      if (msg != '') this.fetchData('YES')
    })

  }

  fetchData(checkcase: any) {
    this.githubService.fetchDataFromGitHub().subscribe(
      (response: any) => {
        this.content = atob(response.content); // Decode content from base64
        let contentfake = this.content.trim().split('GORAR@WS#P@R@TOR')
        contentfake.pop()
        this.dataarrayobj = []
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
        // console.log([this.dataarrayobj,checkcase])
        if (checkcase === 'YES') {
          let tempstoreuser: any = []
          this.dataarrayobj.filter((el: any) => {
            // console.log(el)
            if (el.Name === this.msg) {
              tempstoreuser.push(el)
            }
          });
          this.dataarrayobj = tempstoreuser
          if (this.dataarrayobj[0] == undefined) {
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
              title: 'No user data! Check username filter'
            })


          }
          // console.log([this.dataarrayobj, tempstoreuser, 'afterdown', this.msg])
        }


        let lastEnteredDataForEachUser: any = _.map(_.groupBy(this.dataarrayobj, 'Name'), userObjects => {
          return _.map(_.groupBy(userObjects, 'Date'), dateObjects => _.last(dateObjects));
        });
        lastEnteredDataForEachUser = _.flattenDeep(lastEnteredDataForEachUser)
        lastEnteredDataForEachUser = Object.values(this.groupAndSum(lastEnteredDataForEachUser, 'Date', 'AccountBalance', 'InhandBalance', 'Price', 'Name'));
        // console.log(lastEnteredDataForEachUser);

        this.dataarrayobj = Object.values(this.groupAndSum(this.dataarrayobj, 'Date', 'AccountBalance', 'InhandBalance', 'Price', 'Name'));
        // console.log(this.dataarrayobj);
        this.dataarrayobj.forEach((el: any) => {
          lastEnteredDataForEachUser.forEach((user: any) => {

            if (user.Date == el.Date) {
              el.value1 = user.AccountBalance
              el.value2 = user.InhandBalance
            }
          })
          el.date = new Date(el.Date)
          el.value3 = el.Price
        });
        this.dataarrayobj = _.sortBy(this.dataarrayobj, (item) => new Date(item.date));
        // console.log([this.dataarrayobj, 'afterdown'])
        this.createChart()
      },
      error => {
        // console.error('Error fetching data from GitHub:', error);
      }
    );
  }










  groupAndSum(array: any, groupByKey: any, sumByKey1: any, sumByKey2: any, sumByKey3: any, userKey: any) {
    return Object.values(array.reduce((result: any, item: any) => {
      const key = item[groupByKey];
      const value1 = item[sumByKey1];
      const value2 = item[sumByKey2];
      const value3 = item[sumByKey3];
      const Name = item[userKey];


      if (!result[key]) {
        result[key] = { [groupByKey]: key, [sumByKey1]: 0, [sumByKey2]: 0, [sumByKey3]: 0, ['Name']: Name };
      }

      result[key][sumByKey1] += value1;
      result[key][sumByKey2] += value2;
      result[key][sumByKey3] += value3;

      return result;
    }, {}));
  }



  createChart(): void {
    // Create chart instance
    const screenWidth = window.innerWidth;
    this.chart = am4core.create('chartdivdownfall', am4charts.XYChart);

    // Sample data (replace with your actual data)
    const data = this.dataarrayobj;

    this.chart.data = data;

    // Create date axis
    const dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 25;
    dateAxis.renderer.labels.template.fontSize = 12;
    dateAxis.renderer.labels.template.rotation = 45;
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.zoomable = true;

    // Create value axis
    const valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    dateAxis.zoomable = true;

    // Create first series (line for the first X-axis)
    const series1 = this.chart.series.push(new am4charts.LineSeries());
    series1.dataFields.dateX = 'date';
    series1.dataFields.valueY = 'value1';
    series1.tooltipText = `{value1} Rs AccountBalance in {date}`;
    series1.strokeWidth = 2;
    series1.stroke = am4core.color("green");



    // Create second series (line for the second X-axis)
    const series2 = this.chart.series.push(new am4charts.LineSeries());
    series2.dataFields.dateX = 'date';
    series2.dataFields.valueY = 'value2';
    series2.tooltipText = '{value2} Rs InhandBalance in {date}';
    series2.strokeWidth = 2;



    // Create third series (line for the third X-axis)
    const series3 = this.chart.series.push(new am4charts.LineSeries());
    series3.dataFields.dateX = 'date';
    series3.dataFields.valueY = 'value3';
    series3.tooltipText = '{value3} Rs Spent in {date}';
    series3.strokeWidth = 2;
    series3.stroke = am4core.color("red");

    // Enable chart cursor
    this.chart.cursor = new am4charts.XYCursor();
    this.chart.cursor.behavior = 'zoomX';

    // Enable scrollbar
    this.chart.scrollbarX = new am4core.Scrollbar();
    this.chart.scrollbarX.marginBottom = 30;

    // Add legend
    this.chart.legend = new am4charts.Legend();


    if (screenWidth < 767) {
      this.chart.events.on('ready', () => {
        const currentDate = new Date();
        const startOfLast7Days = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7);

        dateAxis.zoomToDates(startOfLast7Days, currentDate, true);
        series1.tooltipText = `{value1} Rs AccBal {date}`;
        series2.tooltipText = '{value2} Rs InHBal {date}';
        series3.tooltipText = '{value3} Rs Spent {date}';


      });

    }
    else {
      this.chart.events.on('ready', () => {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        dateAxis.zoomToDates(startOfMonth, endOfMonth, true);
      });
    }

  }




  private disposeChart() {
    if (this.chart) {
      this.chart.dispose();
      console.log('Chart disposed successfully.');
    } else {
      console.warn('Chart was not initialized before disposal.');
    }
  }





}

