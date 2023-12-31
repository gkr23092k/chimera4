import { Component, OnInit, OnDestroy } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { GithubServiceService } from 'src/app/service/github-service.service';
import * as _ from 'lodash';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-negative-line-chart',
  templateUrl: './negative-line-chart.component.html',
  styleUrls: ['./negative-line-chart.component.css']
})
export class NegativeLineChartComponent implements OnInit, OnDestroy {
  private chart!: am4charts.XYChart;
  dataarrayobj: any = [];
  content: string = '';
  groupedData: any = [];
  msg: any='';

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
      if(msg!='')this.fetchData('YES')
    })

  }


  ngOnDestroy() {
    this.disposeChart();
  }
  fetchData(checkcase:any) {
    this.githubService.fetchDataFromGitHub().subscribe(
      (response: any) => {
        this.content = atob(response.content); // Decode content from base64
        let contentfake = this.content.trim().split('GORAR@WS#P@R@TOR')
        contentfake.pop()
        this.dataarrayobj=[]
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
          this.dataarrayobj.filter((el: any) => {
            // console.log(el)
            if (el.Name === this.msg) {
              tempstoreuser.push(el)
            }
          });
          this.dataarrayobj = tempstoreuser
          // console.log([this.dataarrayobj,tempstoreuser,'after',this.msg])
        }
        this.groupedData = Object.values(this.groupAndSumByMonthYear(this.dataarrayobj, 'Date', 'Price'));
        console.log(this.groupedData);
        this.groupedData.forEach((el: any) => {
          el.date = el.monthYear
          el.value = el.Price
        })
        this.groupedData = _.sortBy(this.groupedData, (item) => new Date(item.date));

        this.initializeChart();
      },
      error => {
        console.error('Error fetching data from GitHub:', error);
      }
    );
  }

  groupAndSumByMonthYear(array: any, dateKey: any, sumByKey: any) {
    return array.reduce((result: any, item: any) => {
      const key = new Date(item[dateKey]);
      const monthYearKey = `${key.getMonth() + 1}-${key.getFullYear()}`;
      const value = item[sumByKey];

      if (!result[monthYearKey]) {
        result[monthYearKey] = { monthYear: monthYearKey, [sumByKey]: 0 };
      }

      result[monthYearKey][sumByKey] += value;

      return result;
    }, {});
  }






  // this.chart.data = this.groupedData

  // ...

  initializeChart() {
    // Create chart instance
    this.chart = am4core.create('negative-line-chart', am4charts.XYChart);

    const processedData = this.groupedData.map((item: any) => {
      const [month, year] = item.monthYear.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);

      // Use DateFormatter to format the date
      const dateFormatter = new am4core.DateFormatter();
      dateFormatter.dateFormat = 'MM-yyyy';
      const formattedDate = dateFormatter.format(date);

      return { date: formattedDate, value: item.value };
    });


    // Add processed data to the chart
    this.chart.data = processedData;
    console.log(processedData)
    // Create date axis
    const dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 0; // or set it to a smaller value like 30


    // Create value axis
    const valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    const series = this.chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = 'date';
    series.dataFields.valueY = 'value';
    series.strokeWidth = 2;
    series.tooltipText = '{valueY} in {date}';

    // Enable chart cursor
    this.chart.cursor = new am4charts.XYCursor();
    this.chart.cursor.behavior = 'zoomX';

    // Enable scrollbar
    this.chart.scrollbarX = new am4core.Scrollbar();
    this.chart.scrollbarX.marginBottom = 30;
    dateAxis.renderer.labels.template.fontSize = 12; // Adjust the font size as needed
    dateAxis.renderer.labels.template.rotation = 45; // Adjust the rotation angle as needed
    dateAxis.renderer.grid.template.location = 0.5; // Adjust the grid location to center the labels


    // Add legend
    this.chart.legend = new am4charts.Legend();
    // Dynamically set zoom range to the past 5 months and the next 5 months
    const currentDate = new Date();
    const pastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, 1);
    const futureDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 5, 31);

    this.chart.events.on('ready', () => {
      dateAxis.zoomToDates(pastDate, futureDate, true);
    });


  }

  // ...




  private disposeChart() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
}
