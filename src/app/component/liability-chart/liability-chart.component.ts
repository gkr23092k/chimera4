
import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { GithubServiceService } from 'src/app/service/github-service.service';
import * as _ from 'lodash';
import Swal from 'sweetalert2';

am4core.useTheme(am4themes_animated);
@Component({
  selector: 'app-liability-chart',
  templateUrl: './liability-chart.component.html',
  styleUrls: ['./liability-chart.component.css']
})
export class LiabilityChartComponent implements OnInit {
  private chart!: am4charts.PieChart3D;
  private chart1!: am4charts.PieChart3D;
  dataarrayobj: any = [];
  content: string = '';
  groupedData: any = [];
  msg: any = '';
  liableget: any = [];
  liablegive: any = [];
  secondchart: any = [];

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
        this.liableget = []
        this.liablegive = []
        this.dataarrayobj.filter((el: any) => { if (el.Liabilitystatus == 'Get') this.liableget.push(el) })
        this.dataarrayobj.filter((el: any) => { if (el.Liabilitystatus == 'Give') this.liablegive.push(el) })
        const groupedByKeysliableget = _.groupBy(this.liableget, 'Name');
        const groupedByKeysliablegive = _.groupBy(this.liablegive, 'Name');
        let resultObjectget: any = _.mapValues(groupedByKeysliableget, group => _.last(group).Price);
        const resultObjectValueget: any = {
          ...resultObjectget,
          value: _.sum(Object.values(resultObjectget)),
                    category:'Liability Get'

        };

        let resultObjectgive: any = _.mapValues(groupedByKeysliablegive, group => _.last(group).Price);
       const resultObjectValuegive: any = {
          ...resultObjectgive,
          value: _.sum(Object.values(resultObjectgive)),
          category:'Liability Give'
        };

        this.secondchart = [resultObjectValueget, resultObjectValuegive]
console.log('resultObjectValueget',this.secondchart,resultObjectValueget)
        this.dataarrayobj = this.dataarrayobj.filter((expense: any) => expense['Materialgroup'] == 'Investment' || expense['Materialgroup'] == 'Liability');
        this.dataarrayobj.filter((el: any) => {
          if (el.Materialgroup == 'Liability' && el.Liabilitystatus == 'Give') {
            el.Materialgroup = 'Liability Give'
          }
          else if (el.Materialgroup == 'Liability' && el.Liabilitystatus == 'Get') {
            el.Materialgroup = 'Liability Get'
          }
        })

        this.groupedData = Object.values(this.groupAndSum(this.dataarrayobj, 'Materialgroup', 'Price'));
        console.log(this.groupedData);
        this.groupedData.forEach((el: any) => {
          el.category = el.Materialgroup
          el.value = el.Price
        })
        this.disposeChart()
        this.initializeChart();
        this.initializeChart1();
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
    this.chart = am4core.create('liability-chartdiv', am4charts.PieChart3D); // Unique container ID
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
    this.setLabelRadius(series);
    series.colors.list = [

      am4core.color("#97C465"),
      am4core.color("#D32F2F"),
      am4core.color("#FFC75F"),
      am4core.color("#F9F871"),
      am4core.color("#81D4FA"),
      am4core.color("#AZE278"),

    ];

    this.chart.legend = new am4charts.Legend();

  }
  private initializeChart1() {
    // Check if the chart is already initialized
    this.chart1 = am4core.create('liability-chartdiv1', am4charts.PieChart3D); // Unique container ID
    this.chart1.innerRadius = am4core.percent(55);

    // Add data (replace this with your actual data)
    this.chart1.data = this.secondchart

    // Add series
    const series1 = this.chart1.series.push(new am4charts.PieSeries3D());
    series1.dataFields.value = 'value';
    series1.dataFields.category = 'category';

    // Add labels
    series1.labels.template.text = '{category}:{value.value}';
    series1.labels.template.fill = am4core.color('Black');
    this.setLabelRadius1(series1);
    series1.colors.list = [

      am4core.color("#97C465"),
      am4core.color("#D32F2F"),
      am4core.color("#FFC75F"),
      am4core.color("#F9F871"),
      am4core.color("#81D4FA"),
      am4core.color("#AZE278"),

    ];

    this.chart1.legend = new am4charts.Legend();

  }

  private setLabelRadius(series:any) {
    const screenWidth = window.innerWidth;
    console.log(screenWidth, 'screenWidth')
    // Adjust the radius based on the screen size
    const radiusPercent = screenWidth < 950 ? -75 : -25;

     series = this.chart.series.getIndex(0) as am4charts.PieSeries3D;
    if (series) {
      series.labels.template.radius = am4core.percent(radiusPercent);
    }
  }
  private setLabelRadius1(series1:any) {
    const screenWidth = window.innerWidth;
    console.log(screenWidth, 'screenWidth')
    // Adjust the radius based on the screen size
    const radiusPercent = screenWidth < 950 ? -60 : -25;

     series1 = this.chart1.series.getIndex(0) as am4charts.PieSeries3D;
    if (series1) {
      series1.labels.template.radius = am4core.percent(radiusPercent);
    }
  }
  disposeChart() {
    if (this.chart1) {
      this.chart.dispose();
      console.log('Chart disposed successfully.');
    } else {
      console.warn('Chart was not initialized before disposal.');
    }
  }
}

