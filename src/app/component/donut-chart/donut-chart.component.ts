import { Component, OnInit, OnDestroy } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { GithubServiceService } from 'src/app/service/github-service.service';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.css']
})
export class DonutChartComponent implements OnInit, OnDestroy {
  private chart!: am4charts.PieChart3D;
  dataarrayobj: any=[];
  content: string = '';
  groupedData: any=[];

  constructor(private githubService: GithubServiceService) { }

  ngOnInit() {
    this.fetchData()
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
        
       this.groupedData = Object.values(this.groupAndSum(this.dataarrayobj, 'Materialgroup', 'Price'));
        console.log(this.groupedData);
        this.groupedData.forEach((el:any)=>{
          el.category=el.Materialgroup
          el.value=el.Price
        })

        this.initializeChart();
      },
      error => {
        console.error('Error fetching data from GitHub:', error);
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

  ngOnDestroy() {
    this.disposeChart();
  }

  private initializeChart() {
    // Check if the chart is already initialized
    if (!this.chart) {
      this.chart = am4core.create('donut-chartdiv', am4charts.PieChart3D); // Unique container ID
      this.chart.innerRadius = am4core.percent(40);

      // Add data (replace this with your actual data)
      this.chart.data = this.groupedData

      // Add series
      const series = this.chart.series.push(new am4charts.PieSeries3D());
      series.dataFields.value = 'value';
      series.dataFields.category = 'category';

      // Add labels
      series.labels.template.text = '{category}:{value.value}';
      series.labels.template.radius = am4core.percent(-20);
      series.labels.template.fill = am4core.color('Black');

      this.chart.legend = new am4charts.Legend();
      
    } else {
      console.warn('Chart is already initialized.');
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
