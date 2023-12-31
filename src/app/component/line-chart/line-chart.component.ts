import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { GithubServiceService } from 'src/app/service/github-service.service';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit, OnDestroy {
  private chart!: am4charts.XYChart;
  content: string='';
  dataarrayobj: any=[];

  constructor(private githubService:GithubServiceService){}
  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
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
          const dataObject: any = {};

          objdata.forEach((pair: any) => {
            const [key, value] = pair.split(':');
            dataObject[key] = isNaN(value) ? value.trim() : parseFloat(value);
          });
          this.dataarrayobj.push(dataObject)
        })
        this.dataarrayobj.forEach((el:any) => {
          el.value=el.Price
          el.date= new Date(el.Date)
        });
        console.log(this.dataarrayobj)
        this.dataloaded()
      },
      error => {
        console.error('Error fetching data from GitHub:', error);
      }
    );
  }



  dataloaded() {
    // Create chart instance
    this.chart = am4core.create('chartdiv', am4charts.XYChart);

    
    this.chart.data = this.dataarrayobj

    // Create date axis
    const dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 60;

    // Create value axis
    const valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    const series = this.chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = 'date';
    series.dataFields.valueY = 'value';
    series.tooltipText = '{value} in {date}';
    series.strokeWidth = 2;

    // Enable chart cursor
    this.chart.cursor = new am4charts.XYCursor();
    this.chart.cursor.behavior = 'zoomX';

    // Enable scrollbar
    this.chart.scrollbarX = new am4core.Scrollbar();
    this.chart.scrollbarX.marginBottom = 10;

    // Add legend
    this.chart.legend = new am4charts.Legend();

    // Zoom to a specific date range (optional)
    this.chart.events.on('ready', () => {
      dateAxis.zoomToDates(new Date(2023, 0, 1), new Date(2023, 31, 12),false);
    });
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
}
