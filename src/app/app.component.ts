import { Component, OnInit } from '@angular/core';
import { Chart, ChartType, PluginOptionsByType, registerables } from 'chart.js';
import PluginService from 'chart.js/dist/core/core.plugins';
import Annotation from 'chartjs-plugin-annotation';
import 'chartjs-adapter-date-fns';
import { dummyDataModel } from './dummyDataMode';
import { InteractionItem } from 'chart.js/dist/core/core.interaction';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'charts';
  chart: Chart;
  draggableChart: Chart;
  _chartData: dummyDataModel;
  chartWithTimeline = 'chartWithTimeline';
  activePoint: InteractionItem;
  data = {
    datasets: [
      {
        data: [
          {
            x: new Date('2023-12-14T10:00:00').getTime(),
            y: 20,
          },
          {
            x: new Date('2023-12-14T11:00:00').getTime(),
            y: 5,
          },
          {
            x: new Date('2023-12-14T12:00:00').getTime(),
            y: 5,
          },
          {
            x: new Date('2023-12-14T13:00:00').getTime(),
            y: 12,
          },
          {
            x: new Date('2023-12-14T14:00:00').getTime(),
            y: 8,
          },
          {
            x: new Date('2023-12-14T15:50:00').getTime(),
            y: 2,
          },
          {
            x: new Date('2023-12-14T16:00:00').getTime(),
            y: 6,
          },
          {
            x: new Date('2023-12-14T17:00:00').getTime(),
            y: 20,
          },
          {
            x: new Date('2023-12-14T18:00:00').getTime(),
            y: 9,
          },
          {
            x: new Date('2023-12-14T19:20:00').getTime(),
            y: 16,
          },
          {
            x: new Date('2023-12-14T19:30:00').getTime(),
            y: 7,
          },
          {
            x: new Date('2023-12-14T21:00:00').getTime(),
            y: 7,
          },
          {
            x: new Date('2023-12-14T22:00:00').getTime(),
            y: 7,
          },
          {
            x: new Date('2023-12-14T23:00:00').getTime(),
            y: 7,
          },
          {
            x: new Date('2023-12-14T24:00:00').getTime(),
            y: 7,
          },
        ],
      },
    ],
  };

  convertData() {
    const chartData: dummyDataModel = {
      test: [],
    };
    this._chartData = chartData;
  }

  constructor() {}

  ngOnInit(): void {
    this.generateTimelineChart();
    this.generateDragableChart();

    setInterval(() => {
      this.chart.update();
    }, 1000);
  }

  generateTimelineChart() {
    const arbitaryLine = {
      id: 'arbitaryLine',
      beforeDraw(chart, args, options) {
        const {
          ctx,
          chartArea: { top, right, bottom, left, width, height },
          scales: { x, y },
        } = chart;
        ctx.save();
        // 1. How to draw a line

        // x0 = starting point on the horizontal line, left/right
        // y0 = starting point on the vertical line, top/bottom
        // x1 = length on the horizontal line, left/right
        // y1 = length on the vertical line, top/bottom
        // ctx.strokeRect(x0,y0,x1,y1);

        // const currentTime = new Date().getTime();
        //   ctx.strokeRect(x.getPixelForValue(currentTime), top, 0, height);
        ctx.strokeStyle = options.lineColor;
        const currentTime = new Date().getTime();
        ctx.strokeRect(x.getPixelForValue(currentTime), top, 0, height);
        console.log('done');

        ctx.restore();
      },
    };

    Chart.register(Annotation, ...registerables);

    const canvas: HTMLCanvasElement = document.getElementById(
      'LineWithLine'
    ) as HTMLCanvasElement;
    const ctx = (canvas as HTMLCanvasElement)?.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: this.data,
      options: {
        animation: {
          duration: 0,
        },
        interaction: {
          intersect: false,
          axis: 'x' as const,
        },
        responsive: true,
        maintainAspectRatio: true,
        spanGaps: true,
        scales: {
          x: {
            grid: {
              display: true,
            },
            type: 'time' as const,
            time: {
              unit: 'hour',
              displayFormats: {
                hour: 'HH:mm',
              },
            },
            position: 'bottom',
            // afterBuildTicks: (scale)=>{
            //   if(!scale.ticks){
            //     scale.ticks.map
            //   }
            // }
          },
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          arbitaryLine: {
            lineColor: 'blue',
          },
          tooltip: {
            // mode: 'nearest',
            xAlign: 'left',
            // position: 'nearest',
            // intersect: true,
            callbacks: {
              labelColor: (context)=>{
                return {
                  borderColor: 'red',
                  backgroundColor: 'red',
                  
                }
              }
            }
          }
        },
      },
      plugins: [arbitaryLine],
    });
  }

  generateDragableChart() {
    const canvas: HTMLCanvasElement = document.getElementById(
      'draggableChart'
    ) as HTMLCanvasElement;
    const ctx = (canvas as HTMLCanvasElement)?.getContext('2d');
    this.draggableChart = new Chart(ctx, {
      type: 'line',
      data: this.data,
      options: {
        animation: {
          duration: 0,
        },
        interaction: {
          intersect: false,
          axis: 'x' as const,
        },
        responsive: true,
        maintainAspectRatio: true,
        spanGaps: true,
        scales: {
          x: {
            grid: {
              display: true,
            },
            type: 'time' as const,
            time: {
              unit: 'hour',
              displayFormats: {
                hour: 'HH:mm',
              },
            },
            position: 'bottom',
          },
          y: {
            
           min: 0,
           max: 10,
            beginAtZero: true,
          },
        },
      },
    });
    canvas.addEventListener('pointerdown', this.setActiveElement.bind(this));
    canvas.addEventListener('pointermove', this.updatePoint.bind(this));
    canvas.addEventListener('pointerup', this.removeActiveElement.bind(this));
  }

  setActiveElement(event: PointerEvent) {
    const elements = this.draggableChart.getElementsAtEventForMode(
      event,
      'nearest',
      { intersect: true },
      false
    );
    if (elements.length === 0) {
      return;
    }
    elements.forEach((element) => {
      if (element) {
        this.activePoint = element;
      } else {
        return;
      }
    });
  }

  updatePoint(event: PointerEvent) {
    const elements = this.draggableChart.getElementsAtEventForMode(
      event,
      'nearest',
      { intersect: true },
      true
    );
    this.draggableChart.canvas.style.cursor = 'default';
    elements.forEach((element) => {
      if (element.datasetIndex === 0) {
        this.draggableChart.canvas.style.cursor = 'pointer';
      }
    });
    if (this.activePoint) {
      this.draggableChart.canvas.style.cursor = 'pointer';
      let rect = this.draggableChart.canvas.getBoundingClientRect();
      let datasetIndex = this.activePoint['datasetIndex'];
      let index = this.activePoint.index;
      let scale = this.draggableChart.scales['y'].id;
      let value = this.draggableChart.scales[scale].getValueForPixel(
        event.clientY - rect.top
      );
      value = Math.round(value);
      let maxValue: number = 100;
      let minValue: number = 0;
      if (value <= minValue) {
        value = minValue;
      } else if (value >= maxValue) {
        value = maxValue;
      }
      this.draggableChart.data.datasets[datasetIndex].data[index]['y'] = value;
      this.draggableChart.update();
    }
  }
  removeActiveElement() {
    this.activePoint = null;
  }
}
