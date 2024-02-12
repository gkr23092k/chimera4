import { Component, OnInit, OnDestroy } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4plugins_forceDirected from '@amcharts/amcharts4/plugins/forceDirected';
import _ from 'lodash';
import { GithubServiceService } from 'src/app/service/github-service.service';

@Component({
  selector: 'app-bubble',
  templateUrl: './bubble.component.html',
  styleUrls: ['./bubble.component.css']
})
export class BubbleComponent implements OnInit, OnDestroy {

  private chart!: am4plugins_forceDirected.ForceDirectedTree;

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
          // console.log([this.dataarrayobj, tempstoreuser, 'afterdonut', this.msg])
        }
        let tempgrooupdatarraobj = this.dataarrayobj.filter((expense: any) => expense['Materialgroup'] != 'Liability');
        let tempholderdataarrobj = Object.values(this.groupAndSum(this.dataarrayobj, 'Material', 'Price'));
        this.groupedData = Object.values(this.groupAndSum(tempgrooupdatarraobj, 'Materialgroup', 'Price'));
        let total = 0
        let tempgroupname: any = []
        this.groupedData.forEach((el: any) => {
          el.name = el.Materialgroup
          el.category = el.Materialgroup
          el.value = el.Price
          total += el.Price
          tempgroupname.push(el.Materialgroup)
        })

        tempholderdataarrobj.forEach((temp: any) => {
          this.dataarrayobj.forEach((el: any) => {
            if (temp.Material == el.Material) {
              temp.Materialgroup = el.Materialgroup
            }
          })
        })

        this.groupedData.forEach((grp: any, index: number) => {
          tempholderdataarrobj.forEach((mat: any) => {
            if (grp.Materialgroup == mat.Materialgroup) {
              if (this.groupedData[index].children == undefined) this.groupedData[index].children = []
              grp.linkWith = tempgroupname
              this.groupedData[index].children.push({ name: mat.Material, value: mat.Price })
            }
          });
        });



        this.groupedData.forEach((item: any) => {
          item.value = (item.value / total) * 100;
          item.value = item.value * 100
          item.children.forEach((chel: any) => {
            chel.percentage = (chel.value / item.Price) * 100;
            chel.Price = chel.value
            chel.value = chel.percentage*5
          });
        });


        // console.log(this.groupedData, this.dataarrayobj, tempholderdataarrobj, total)

        this.bubblechart(this.groupedData)
        const sortedObject = _.sortBy([...this.groupedData], 'Materialgroup');
        this.groupedData = sortedObject

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
  bubblechart(chartdata: any) {
    // Create chart instance
    this.chart = am4core.create('bubble', am4plugins_forceDirected.ForceDirectedTree);

    // Set chart data
    this.chart.data = chartdata
    //  [
    //   {
    //     "name": "Phoebe",
    //     "value": 102,
    //     "linkWith": [
    //       "Gunther"
    //     ],
    //     "children": [
    //       {
    //         "name": "David",
    //         "value": 14
    //       },
    //       {
    //         "name": "Roger",
    //         "value": 1
    //       },
    //       {
    //         "name": "Duncan",
    //         "value": 1
    //       },
    //       {
    //         "name": "Rob Dohnen",
    //         "value": 2
    //       },
    //       {
    //         "name": "Ryan",
    //         "value": 5
    //       },
    //       {
    //         "name": "Malcom",
    //         "value": 1
    //       },
    //       {
    //         "name": "Robert",
    //         "value": 1
    //       },
    //       {
    //         "name": "Sergei",
    //         "value": 1
    //       },
    //       {
    //         "name": "Vince",
    //         "value": 2
    //       },
    //       {
    //         "name": "Jason",
    //         "value": 1
    //       },
    //       {
    //         "name": "Rick",
    //         "value": 2
    //       },
    //       {
    //         "name": "Gary",
    //         "value": 7
    //       },
    //       {
    //         "name": "Jake",
    //         "value": 2
    //       },
    //       {
    //         "name": "Eric",
    //         "value": 3
    //       },
    //       {
    //         "name": "Mike",
    //         "value": 18
    //       }
    //     ]
    //   },
    //   {
    //     "name": "Monica",
    //     "value": 204,
    //     "linkWith": [
    //       "Rachel",
    //       "Chandler",
    //       "Ross",
    //       "Joey",
    //       "Phoebe"
    //     ],
    //     "children": [
    //       {
    //         "name": "Paul the wine guy",
    //         "value": 1
    //       },
    //       {
    //         "name": "Mr Geller",
    //         "value": 8
    //       },
    //       {
    //         "name": "Mrs Geller",
    //         "value": 14
    //       },
    //       {
    //         "name": "Aunt Lilian",
    //         "value": 2
    //       },
    //       {
    //         "name": "Nana",
    //         "value": 1
    //       },
    //       {
    //         "name": "Young Ethan",
    //         "value": 5
    //       },
    //       {
    //         "name": "Ben",
    //         "value": 9
    //       },
    //       {
    //         "name": "Fun Bobby",
    //         "value": 3
    //       },
    //       {
    //         "name": "Richard",
    //         "value": 16
    //       },
    //       {
    //         "name": "Mrs Green",
    //         "value": 4
    //       },
    //       {
    //         "name": "Paolo2",
    //         "value": 1
    //       },
    //       {
    //         "name": "Pete",
    //         "value": 10
    //       },
    //       {
    //         "name": "Chip",
    //         "value": 1
    //       },
    //       {
    //         "name": "Timothy (Burke)",
    //         "value": 1
    //       },
    //       {
    //         "name": "Emily",
    //         "value": 17
    //       },
    //       {
    //         "name": "Dr. Roger",
    //         "value": 3
    //       }
    //     ]
    //   },
    //   {
    //     "name": "Ross",
    //     "value": 216,
    //     "linkWith": [
    //       "Joey",
    //       "Phoebe",
    //       "Mrs Geller",
    //       "Aunt Lilian",
    //       "Mrs Bing",
    //       "Ben",
    //       "Mrs Green",
    //       "Emily"
    //     ],
    //     "children": [
    //       {
    //         "name": "Carol",
    //         "value": 10
    //       },
    //       {
    //         "name": "Celia",
    //         "value": 2
    //       },
    //       {
    //         "name": "Julie",
    //         "value": 6
    //       },
    //       {
    //         "name": "Chloe",
    //         "value": 1
    //       },
    //       {
    //         "name": "Bonnie",
    //         "value": 4
    //       },
    //       {
    //         "name": "Messy Girl (Cheryl)",
    //         "value": 5
    //       },
    //       {
    //         "name": "Jill",
    //         "value": 1
    //       },
    //       {
    //         "name": "Elizabeth",
    //         "value": 8
    //       },
    //       {
    //         "name": "Aunt Millie",
    //         "value": 2
    //       },
    //       {
    //         "name": "Mona",
    //         "value": 11
    //       },
    //       {
    //         "name": "Emma",
    //         "value": 7
    //       },
    //       {
    //         "name": "Charlie",
    //         "value": 13
    //       }
    //     ]
    //   },
    //   {
    //     "name": "Chandler",
    //     "value": 167,
    //     "linkWith": [
    //       "Joey",
    //       "Phoebe"
    //     ],
    //     "children": [
    //       {
    //         "name": "Aurora",
    //         "value": 2
    //       },
    //       {
    //         "name": "Jill Goodacre",
    //         "value": 1
    //       },
    //       {
    //         "name": "Janice",
    //         "value": 12
    //       },
    //       {
    //         "name": "Mrs Bing",
    //         "value": 6
    //       },
    //       {
    //         "name": "Nina",
    //         "value": 1
    //       },
    //       {
    //         "name": "Susie",
    //         "value": 5
    //       },
    //       {
    //         "name": "Mary Theresa",
    //         "value": 1
    //       },
    //       {
    //         "name": "Ginger",
    //         "value": 2
    //       },
    //       {
    //         "name": "Joanna",
    //         "value": 5
    //       },
    //       {
    //         "name": "Kathy",
    //         "value": 9
    //       },
    //       {
    //         "name": "Mr Bing",
    //         "value": 1
    //       }
    //     ]
    //   },
    //   {
    //     "name": "Rachel",
    //     "value": 158,
    //     "linkWith": [
    //       "Chandler",
    //       "Ross",
    //       "Joey",
    //       "Phoebe",
    //       "Mr Geller",
    //       "Mrs Geller"
    //     ],
    //     "children": [
    //       {
    //         "name": "Paolo",
    //         "value": 5
    //       },
    //       {
    //         "name": "Barry",
    //         "value": 1
    //       },
    //       {
    //         "name": "Dr Green",
    //         "value": 3
    //       },
    //       {
    //         "name": "Mark3",
    //         "value": 1
    //       },
    //       {
    //         "name": "Josh",
    //         "value": 2
    //       },
    //       {
    //         "name": "Gunther",
    //         "value": 2
    //       },
    //       {
    //         "name": "Joshua",
    //         "value": 3
    //       },
    //       {
    //         "name": "Danny",
    //         "value": 1
    //       },
    //       {
    //         "name": "Mr. Zelner",
    //         "value": 1
    //       },
    //       {
    //         "name": "Paul Stevens",
    //         "value": 3
    //       },
    //       {
    //         "name": "Tag",
    //         "value": 4
    //       },
    //       {
    //         "name": "Melissa",
    //         "value": 1
    //       },
    //       {
    //         "name": "Gavin",
    //         "value": 2
    //       }
    //     ]
    //   },
    //   {
    //     "name": "Joey",
    //     "value": 250,
    //     "linkWith": [
    //       "Phoebe",
    //       "Janice",
    //       "Mrs Green",
    //       "Kathy",
    //       "Emily",
    //       "Charlie"
    //     ],
    //     "children": [
    //       {
    //         "name": "Lorraine",
    //         "value": 100
    //       },
    //       {
    //         "name": "Melanie",
    //         "value": 2
    //       },
    //       {
    //         "name": "Erica",
    //         "value": 2
    //       },
    //       {
    //         "name": "Kate",
    //         "value": 4
    //       },
    //       {
    //         "name": "Lauren",
    //         "value": 2
    //       },
    //       {
    //         "name": "Estelle",
    //         "value": 1
    //       },
    //       {
    //         "name": "Katie",
    //         "value": 2
    //       },
    //       {
    //         "name": "Janine",
    //         "value": 9
    //       },
    //       {
    //         "name": "Erin",
    //         "value": 1
    //       },
    //       {
    //         "name": "Cecilia",
    //         "value": 3
    //       }
    //     ]
    //   }
    // ];
    // Your data here


    // Create series
    const networkSeries = this.chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries());
    networkSeries.dataFields.linkWith = 'linkWith';
    networkSeries.dataFields.name = 'name';
    networkSeries.dataFields.id = 'name';
    networkSeries.dataFields.value = 'value';
    networkSeries.dataFields.children = 'children';

    networkSeries.nodes.template.label.text = '{name} {Price}';
    networkSeries.fontSize = 12






      ;
    networkSeries.linkWithStrength = 0;

    const nodeTemplate = networkSeries.nodes.template;
    nodeTemplate.tooltipText = '{name} {Price}';
    nodeTemplate.fillOpacity = 1;
    nodeTemplate.label.hideOversized = true;
    nodeTemplate.label.truncate = true;

    const linkTemplate = networkSeries.links.template;
    linkTemplate.strokeWidth = 1;
    const linkHoverState = linkTemplate.states.create('hover');
    linkHoverState.properties.strokeOpacity = 1;
    linkHoverState.properties.strokeWidth = 2;

    nodeTemplate.events.on('over', function (event: any) {
      const dataItem = event.target.dataItem;
      dataItem.childLinks.each(function (link: any) {
        link.isHover = true;
      });
    });

    nodeTemplate.events.on('out', function (event: any) {
      const dataItem = event.target.dataItem;
      dataItem.childLinks.each(function (link: any) {
        link.isHover = false;
      });
    });
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

}




