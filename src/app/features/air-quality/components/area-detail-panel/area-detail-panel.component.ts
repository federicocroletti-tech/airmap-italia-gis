import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { ChartDataset } from 'chart.js';
import { AirQualityArea, HistoricalMetric, PollutionLevel } from '../../models/air-quality.model';
import { AirQualityStyleService } from '../../services/air-quality-style.service';
import { MetricChartComponent } from '../../../../shared/components/metric-chart/metric-chart.component';
import { PollutionLevelLabelPipe } from '../../../../shared/pipes/pollution-level-label.pipe';

@Component({
  selector: 'app-area-detail-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    MatIconModule,
    TranslatePipe,
    MetricChartComponent,
    PollutionLevelLabelPipe,
  ],
  templateUrl: './area-detail-panel.component.html',
  styleUrl: './area-detail-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaDetailPanelComponent {
  @Input() area: AirQualityArea | null = null;
  @Input() history: HistoricalMetric[] = [];

  @Output() analyze = new EventEmitter<AirQualityArea>();
  @Output() exportData = new EventEmitter<AirQualityArea>();
  @Output() closePanel = new EventEmitter<void>();

  private readonly styleService = inject(AirQualityStyleService);

  getBadgeStyle(level: PollutionLevel): Record<string, string> {
    return { '--badge-color': this.styleService.getBadgeColor(level) };
  }

  getChartLabels(): string[] {
    return this.history.map((item) =>
      new Intl.DateTimeFormat('it-IT', { hour: '2-digit' }).format(new Date(item.timestamp)),
    );
  }

  getChartDatasets(): ChartDataset[] {
    return [
      {
        label: 'AQI',
        data: this.history.map((item) => item.aqi),
        borderColor: '#176b87',
        backgroundColor: 'rgba(23, 107, 135, 0.16)',
        tension: 0.35,
        fill: true,
      },
    ];
  }
}
