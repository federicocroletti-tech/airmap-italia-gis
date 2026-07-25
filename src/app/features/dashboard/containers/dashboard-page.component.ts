import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { ChartDataset } from 'chart.js';
import { MetricChartComponent } from '../../../shared/components/metric-chart/metric-chart.component';
import { DashboardSummary } from '../models/dashboard.model';
import { DashboardFacade } from '../facades/dashboard.facade';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslatePipe,
    MetricChartComponent,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit {
  private readonly dashboardFacade = inject(DashboardFacade);

  readonly data = toSignal(this.dashboardFacade.data$, { initialValue: null });
  readonly loading = toSignal(this.dashboardFacade.loading$, { initialValue: false });

  ngOnInit(): void {
    this.dashboardFacade.loadDashboard();
  }

  trackByKpiId(_: number, item: { id: string }): string {
    return item.id;
  }

  getHistoricalLabels(data: DashboardSummary): string[] {
    return data.historicalMetrics.map((item) =>
      new Intl.DateTimeFormat('it-IT', { hour: '2-digit' }).format(new Date(item.timestamp)),
    );
  }

  getHistoricalDatasets(data: DashboardSummary): ChartDataset[] {
    return [
      {
        label: 'AQI',
        data: data.historicalMetrics.map((item) => item.aqi),
        borderColor: '#176b87',
        backgroundColor: 'rgba(23, 107, 135, 0.16)',
        tension: 0.35,
        fill: true,
      },
      {
        label: 'PM10',
        data: data.historicalMetrics.map((item) => item.pm10),
        borderColor: '#ef8f2f',
        backgroundColor: 'rgba(239, 143, 47, 0.14)',
        tension: 0.35,
      },
      {
        label: 'PM2.5',
        data: data.historicalMetrics.map((item) => item.pm25),
        borderColor: '#d84343',
        backgroundColor: 'rgba(216, 67, 67, 0.12)',
        tension: 0.35,
      },
      {
        label: 'NO2',
        data: data.historicalMetrics.map((item) => item.no2),
        borderColor: '#7b3f98',
        backgroundColor: 'rgba(123, 63, 152, 0.12)',
        tension: 0.35,
      },
      {
        label: 'O3',
        data: data.historicalMetrics.map((item) => item.o3),
        borderColor: '#2e7d32',
        backgroundColor: 'rgba(46, 125, 50, 0.12)',
        tension: 0.35,
      },
    ];
  }

  getComparisonLabels(data: DashboardSummary): string[] {
    return data.districtComparison.map((item) => item.district);
  }

  getComparisonDatasets(data: DashboardSummary): ChartDataset[] {
    return [
      {
        label: 'AQI',
        data: data.districtComparison.map((item) => item.aqi),
        backgroundColor: '#176b87',
      },
    ];
  }

  getDistributionLabels(data: DashboardSummary): string[] {
    return data.pollutionDistribution.map((item) => item.level);
  }

  getDistributionDatasets(data: DashboardSummary): ChartDataset[] {
    return [
      {
        label: 'Zone',
        data: data.pollutionDistribution.map((item) => item.count),
        backgroundColor: ['#2e7d32', '#f5c542', '#ef8f2f', '#d84343', '#7b3f98'],
      },
    ];
  }
}
