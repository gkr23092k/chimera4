import { Component, OnInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { GithubServiceService } from 'src/app/service/github-service.service';
import _ from 'lodash';

@Component({
  selector: 'app-stackedcolummn',
  templateUrl: './stackedcolummn.component.html',
  styleUrls: ['./stackedcolummn.component.css']
})
export class StackedcolummnComponent implements OnInit {
  content: any = ''
  dataarrayobj: any = [];
  msg: any;
  initmaterialgroup: any = ['Food', 'Others', 'Selfcare', 'Travel', 'Education', 'Cloths', 'Medical', 'Electronics',
    'Rental', 'Electricity', 'Cosmetics', 'Loan', 'Family', 'Sports', 'Fashion']

  constructor(private githubService: GithubServiceService) { }

  ngOnInit(): void {
    this.fetchData('No')
    this.stackedchart();
  }

  stackedchart() {
    // Themes begin
    am4core.useTheme(am4themes_animated);

    // Create chart instance
    let chart = am4core.create("chartdiv", am4charts.XYChart);

    // Add data

    chart.data = [{
      "year": "2016",
      "europe": 2.5,
      "namerica": 2.5,
      "asia": 2.1,
      "lamerica": 0.3,
      "meast": 0.2,
      "africa": 0.1
    }, {
      "year": "2017",
      "europe": 2.6,
      "namerica": 2.7,
      "asia": 2.2,
      "lamerica": 0.3,
      "meast": 0.3,
      "africa": 0.1
    }, {
      "year": "2018",
      "europe": 2.8,
      "namerica": 2.9,
      "asia": 2.4,
      "lamerica": 0.3,
      "meast": 0.3,
      "africa": 0.1
    }];

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.renderer.grid.template.location = 0;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inside = true;
    valueAxis.renderer.labels.template.disabled = true;
    valueAxis.min = 0;

    // Create series
    function createSeries(field: any, name: any) {
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.name = name;
      series.dataFields.valueY = field;
      series.dataFields.categoryX = "year";
      series.sequencedInterpolation = true;
      series.stacked = true;

      // Configure columns
      series.columns.template.width = am4core.percent(60);
      series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}";

      // Add label
      let labelBullet = series.bullets.push(new am4charts.LabelBullet());
      labelBullet.label.text = "{valueY}";
      labelBullet.locationY = 0.5;
      labelBullet.label.hideOversized = true;

      return series;
    }

    createSeries("europe", "Europe");
    createSeries("namerica", "North America");
    createSeries("asia", "Asia-Pacific");
    createSeries("lamerica", "Latin America");
    createSeries("meast", "Middle-East");
    createSeries("africa", "Africa");

    // Legend
    chart.legend = new am4charts.Legend();
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
            dataObject[key] = isNaN(value) ? (value != null && value != '') ? value.trim() : value : parseFloat(value);
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
        }
        this.dataarrayobj = this.dataarrayobj.filter((expense: any) => expense['Materialgroup'] != 'Investment' && expense['Materialgroup'] != 'Liability');
        this.dataarrayobj.filter((el: any) => {
          let datearray = el.Date.split(' ')
          el.monthyear = `${datearray[1]} ${datearray[3]},${el.Materialgroup}`
        })
        let daata: any = Object.values(this.groupAndSum(this.dataarrayobj, `monthyear`, `Price`))

        daata.filter((el: any) => {
          let monthyeararray = el.monthyear.split(',')
          el.monthyear = monthyeararray[0]
          el.Materialgroup = monthyeararray[1]
        })
        const uniqueMaterialGroups: any = _.uniqBy(daata, 'monthyear').map((obj: any) => obj.monthyear);

        console.log(uniqueMaterialGroups);
        console.log(daata)

        let endata: any = []
        uniqueMaterialGroups.forEach((mat: any, index: number) => {
          daata.forEach((umat: any, i: number) => {

            if (mat == umat.monthyear) {
              endata[index] = mat
              // endata[index].Food=umat
            }
          })
        });
        console.log(endata, 'endata')

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
}
