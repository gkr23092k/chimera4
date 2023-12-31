import { Component, OnInit, OnDestroy } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { GithubServiceService } from 'src/app/service/github-service.service';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-negative-line-chart',
  templateUrl: './negative-line-chart.component.html',
  styleUrls: ['./negative-line-chart.component.css']
})
export class NegativeLineChartComponent implements OnInit, OnDestroy {
  private chart!: am4charts.XYChart;
  dataarrayobj: any=[];
  content: string='';
  groupedData: any=[];

  constructor(private githubService:GithubServiceService) {}

  ngOnInit() {
    this.fetchData();
  }

  ngOnDestroy() {
    this.disposeChart();
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
        
       this.groupedData = Object.values(this.groupAndSumByMonthYear(this.dataarrayobj, 'Date', 'Price'));
        console.log(this.groupedData);
        this.groupedData.forEach((el:any)=>{
          el.date=el.monthYear
          el.value=el.Price
        })
       
        this.initializeChart();
      },
      error => {
        console.error('Error fetching data from GitHub:', error);
      }
    );
  }

 groupAndSumByMonthYear(array:any, dateKey:any, sumByKey:any) {
  return array.reduce((result:any, item:any) => {
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

private initializeChart() {
  // Create chart instance
  this.chart = am4core.create('negative-line-chart', am4charts.XYChart);

  // Process input data
  const processedData = this.groupedData.map((item:any) => {
    const [month, year] = item.monthYear.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1); // Months are 0-based in JavaScript Dates
    return { date, value: item.value };
  });

  // Add processed data to the chart
  this.chart.data = processedData;

  // Create date axis
  const dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.minGridDistance = 60;

  // Create value axis
  const valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());

  // Create series
  const series = this.chart.series.push(new am4charts.LineSeries());
  series.dataFields.dateX = 'date';
  series.dataFields.valueY = 'value';
  series.strokeWidth = 2;
  series.tooltipText = '{valueY} in {date}';   


  // Define negative color for stroke
  series.adapter.add('stroke', (stroke, target) => {
    if (target.dataItem && target.dataItem.dataContext) {
      const value = (target.dataItem.dataContext as any)['value'];
      if (value < 0) {
        return am4core.color('#FF0000'); // Set negative color (red in this example) for stroke
      }
    }
    return stroke;
  });

  // Set negative color for fill
  series.adapter.add('fill', (fill, target) => {
    if (target.dataItem && target.dataItem.dataContext) {
      const value = (target.dataItem.dataContext as any)['value'];
      if (value < 0) {
        return am4core.color('#FFC0C0'); // Set fill color (light red in this example) for negative values
      }
    }
    return fill;
  });

  // Enable chart cursor
  this.chart.cursor = new am4charts.XYCursor();
  this.chart.cursor.behavior = 'zoomX';

  // Enable scrollbar
  this.chart.scrollbarX = new am4core.Scrollbar();
  this.chart.scrollbarX.marginBottom = 5;

  // Add legend
  this.chart.legend = new am4charts.Legend();

  // Dynamically set zoom range to the current year (January to December)
  const currentYear = new Date().getFullYear();
  this.chart.events.on('ready', () => {
    dateAxis.zoomToDates(new Date(currentYear, 1, 1), new Date(currentYear, 12, 31), false);
  });
}

// ...




  private disposeChart() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
}
