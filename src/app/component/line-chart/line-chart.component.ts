import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { GithubServiceService } from 'src/app/service/github-service.service';
import * as _ from 'lodash';
import Swal from 'sweetalert2';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
  private chart!: am4charts.XYChart;
  content: string = '';
  dataarrayobj: any = [];
  msg: any = '';
  constructor(private githubService: GithubServiceService) { }
  ngOnInit() {
    this.fetchData('NO');

    this.githubService.invokeFirstComponentFunction.subscribe((name: string) => {
      console.log('line chart component')
    });

    this.githubService.currentvalue.subscribe((msg: any) => {
      console.log('msg', msg)
      this.msg = msg
      this.disposeChart()
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
            dataObject[key] = isNaN(value) ? (value!=null&&value!='')?value.trim():value : parseFloat(value);
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
          //  console.log([this.dataarrayobj, tempstoreuser, 'after', this.msg])
        }
        this.dataarrayobj = this.dataarrayobj.filter((expense:any )=> expense['Materialgroup'] !== 'Liability' &&expense['Materialgroup'] !== 'Investment');
        this.dataarrayobj= Object.values(this.groupAndSum(this.dataarrayobj, 'Date', 'Price'));
        // console.log(this.dataarrayobj);
        this.dataarrayobj.forEach((el: any) => {
          el.value = el.Price
          el.date = new Date(el.Date)
        });
        this.dataarrayobj = _.sortBy(this.dataarrayobj, (item) => new Date(item.date));
        // console.log(this.dataarrayobj)
        this.dataloaded()
      },
      error => {
        // console.error('Error fetching data from GitHub:', error);
      }
    );
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

  dataloaded() {
    // Create chart instance
    this.chart = am4core.create('chartdiv', am4charts.XYChart);


    this.chart.data = this.dataarrayobj

    // Create date axis 
    const dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 25;
    dateAxis.renderer.labels.template.fontSize = 12; // Adjust the font size as needed
    dateAxis.renderer.labels.template.rotation = 45; // Adjust the rotation angle as needed
    dateAxis.renderer.grid.template.location = 0; // Adjust the grid location to center the labels

    // Create value axis
    const valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    const series = this.chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = 'date';
    series.dataFields.valueY = 'value';
    series.strokeWidth = 2;
    
    // Enable chart cursor
    this.chart.cursor = new am4charts.XYCursor();
    this.chart.cursor.behavior = 'zoomX';
    
    // Enable scrollbar
    this.chart.scrollbarX = new am4core.Scrollbar();
    this.chart.scrollbarX.marginBottom = 30;
    
    // Add legend
    this.chart.legend = new am4charts.Legend();
    const screenWidth = window.innerWidth;
    console.log(screenWidth,'screenWidth')
    if( screenWidth < 767 ){
      this.chart.events.on('ready', () => {
        const currentDate = new Date();
        const startOfLast10Days = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7);
        
        dateAxis.zoomToDates(startOfLast10Days, currentDate, true);
        series.tooltipText = `{value} Rs 
         {date}`;

      });
      
    }
    else{
      this.chart.events.on('ready', () => {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() +1, 0);
        
        dateAxis.zoomToDates(startOfMonth, endOfMonth, true);
        series.tooltipText = '{value} Rs in {date}';
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
