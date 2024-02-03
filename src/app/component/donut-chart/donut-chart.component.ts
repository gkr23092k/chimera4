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
export class DonutChartComponent implements OnInit {
  private chart!: am4charts.PieChart3D;
  dataarrayobj: any = [];
  content: string = '';
  groupedData: any = [];
  msg: any = '';

  constructor(private githubService: GithubServiceService) { }

  ngOnInit() {
    this.fetchData('NO');

    this.githubService.invokeFirstComponentFunction.subscribe((name: string) => {
      console.log('line chart component')
    });

    this.githubService.currentvalue.subscribe(async (msg: any) => {
      console.log('msg', msg)
      this.msg = msg
      this.disposeChart()
      if (msg != '') await this.fetchData('YES')
    })

  }
  async fetchData(checkcase: any) {
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
        if (checkcase === 'YES') {
          let tempstoreuser: any = []
          this.dataarrayobj.filter((el: any) => {
            console.log(el)
            if (el.Name === this.msg) {
              tempstoreuser.push(el)
            }
          });
          this.dataarrayobj = tempstoreuser
          console.log([this.dataarrayobj, tempstoreuser, 'afterdonut', this.msg])
        }
        this.dataarrayobj = this.dataarrayobj.filter((expense: any) => expense['Materialgroup'] != 'Investment'&& expense['Materialgroup'] != 'Liability');

        this.groupedData = Object.values(this.groupAndSum(this.dataarrayobj, 'Materialgroup', 'Price'));
        console.log(this.groupedData);
        this.groupedData.forEach((el: any) => {
          el.category = el.Materialgroup
          el.value = el.Price
        })
        this.disposeChart()
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



  private initializeChart() {
    // Check if the chart is already initialized
    this.chart = am4core.create('donut-chartdiv', am4charts.PieChart3D); // Unique container ID
    this.chart.innerRadius = am4core.percent(55);

    // Add data (replace this with your actual data)
    this.chart.data = this.groupedData

    // Add series
    const series = this.chart.series.push(new am4charts.PieSeries3D());
    series.dataFields.value = 'value';
    series.dataFields.category = 'category';

    // Add labels
    series.labels.template.text = '{category}:{value.value}';
    series.labels.template.fill = am4core.color('Black');
    this.setLabelRadius();
    series.colors.list = [
      am4core.color("#5FB3D9"),
      am4core.color("#845EC9"),
      am4core.color("#AA2121"),
      am4core.color("#E1AA74"),
      am4core.color("#FE2671"),
      am4core.color("#97C465"),
      am4core.color("#FFC75F"),
      am4core.color("#F9F871"),
      am4core.color("#81D4FA"),
      am4core.color("#50623A"),
      am4core.color("#D4E7C5"),
      am4core.color("#E0AED9"),
      am4core.color("#EAD7BB"),

      
      

    ];

    this.chart.legend = new am4charts.Legend();

  }

  private setLabelRadius() {
    const screenWidth = window.innerWidth;
    console.log(screenWidth, 'screenWidth')
    // Adjust the radius based on the screen size
    const radiusPercent = screenWidth < 767 ? -75 : -25;

    const series = this.chart.series.getIndex(0) as am4charts.PieSeries3D;
    if (series) {
      series.labels.template.radius = am4core.percent(radiusPercent);
    }
  }
  disposeChart() {
    if (this.chart) {
      this.chart.dispose();
      console.log('Chart disposed successfully.');
    } else {
      console.warn('Chart was not initialized before disposal.');
    }
  }
}
