import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Chart, ChartConfiguration, ChartDataset, ChartType, registerables } from 'chart.js';

@Component({
  selector: 'app-metric-chart',
  standalone: true,
  imports: [CommonModule],
  template: '<div class="chart-frame"><canvas #canvas></canvas></div>',
  styleUrl: './metric-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() chartType: ChartType = 'line';
  @Input() labels: string[] = [];
  @Input() datasets: ChartDataset[] = [];
  @Input() ariaLabel = 'Environmental metrics chart';

  @ViewChild('canvas') private readonly canvas?: ElementRef<HTMLCanvasElement>;

  private chart?: Chart;
  private static registered = false;

  ngAfterViewInit(): void {
    this.registerChartJs();
    this.renderChart();
  }

  ngOnChanges(): void {
    if (this.chart) {
      this.chart.data.labels = this.labels;
      this.chart.data.datasets = this.datasets;
      this.chart.update();
      return;
    }

    this.renderChart();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private renderChart(): void {
    const canvas = this.canvas?.nativeElement;

    if (!canvas) {
      return;
    }

    canvas.setAttribute('aria-label', this.ariaLabel);
    canvas.setAttribute('role', 'img');

    this.chart?.destroy();
    this.chart = new Chart(canvas, this.getChartConfig());
  }

  private getChartConfig(): ChartConfiguration {
    return {
      type: this.chartType,
      data: {
        labels: this.labels,
        datasets: this.datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              boxWidth: 10,
              usePointStyle: true,
            },
          },
        },
        scales:
          this.chartType === 'doughnut'
            ? undefined
            : {
                x: { grid: { display: false } },
                y: { beginAtZero: true, grid: { color: 'rgba(90, 108, 125, 0.16)' } },
              },
      },
    };
  }

  private registerChartJs(): void {
    if (!MetricChartComponent.registered) {
      Chart.register(...registerables);
      MetricChartComponent.registered = true;
    }
  }
}
