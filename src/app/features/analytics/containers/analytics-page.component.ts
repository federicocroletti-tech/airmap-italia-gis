import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslatePipe } from '@ngx-translate/core';
import { AirQualityFacade } from '../../air-quality/facades/air-quality.facade';
import { AnalyticsFacade } from '../facades/analytics.facade';
import { AnalyticsRankingRow } from '../models/analytics.model';
import { AnalyticsService } from '../services/analytics.service';

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    TranslatePipe,
  ],
  templateUrl: './analytics-page.component.html',
  styleUrl: './analytics-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsPageComponent implements OnInit, AfterViewInit {
  private readonly airQualityFacade = inject(AirQualityFacade);
  private readonly analyticsFacade = inject(AnalyticsFacade);
  private readonly analyticsService = inject(AnalyticsService);

  readonly areas = toSignal(this.airQualityFacade.areas$, { initialValue: [] });
  readonly filters = toSignal(this.analyticsFacade.filters$, {
    initialValue: {
      district: null,
      pollutionLevel: null,
      timeRange: '24h' as const,
      indicator: 'aqi' as const,
    },
  });
  readonly selectedRow = signal<AnalyticsRankingRow | null>(null);
  readonly displayedColumns = [
    'name',
    'district',
    'aqi',
    'pm10',
    'pm25',
    'no2',
    'riskLevel',
    'populationExposure',
  ];
  readonly dataSource = new MatTableDataSource<AnalyticsRankingRow>([]);
  readonly rankingRows = computed(() =>
    this.analyticsService.toRankingRows(this.areas(), this.filters()),
  );
  readonly mostPolluted = computed(() =>
    [...this.rankingRows()].sort((a, b) => b.aqi - a.aqi).slice(0, 5),
  );
  readonly leastPolluted = computed(() =>
    [...this.rankingRows()].sort((a, b) => a.aqi - b.aqi).slice(0, 5),
  );
  readonly districtAverages = computed(() =>
    this.analyticsService.getAverageAqiByDistrict(this.areas()),
  );
  readonly districts = computed(() =>
    [...new Set(this.areas().map((area) => area.district))].sort(),
  );
  readonly pollutionLevels = computed(() =>
    [...new Set(this.areas().map((area) => area.pollutionLevel))].sort(),
  );

  @ViewChild(MatSort) private sort?: MatSort;
  @ViewChild(MatPaginator) private paginator?: MatPaginator;

  private readonly syncDataSource = effect(() => {
    this.dataSource.data = this.rankingRows();
  });

  ngOnInit(): void {
    this.airQualityFacade.loadAreas();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort ?? null;
    this.dataSource.paginator = this.paginator ?? null;
  }

  updateDistrict(value: string): void {
    this.analyticsFacade.updateFilters({ district: value || null });
  }

  updatePollutionLevel(value: string): void {
    this.analyticsFacade.updateFilters({ pollutionLevel: value || null });
  }

  updateTimeRange(value: '24h' | '7d' | '30d'): void {
    this.analyticsFacade.updateFilters({ timeRange: value });
  }

  updateIndicator(value: 'aqi' | 'pm10' | 'pm25' | 'no2' | 'o3'): void {
    this.analyticsFacade.updateFilters({ indicator: value });
  }

  applyTableFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.dataSource.filter = input.value.trim().toLowerCase();
  }

  selectRow(row: AnalyticsRankingRow): void {
    this.selectedRow.set(row);
  }

  trackByName(_: number, row: { name: string }): string {
    return row.name;
  }
}
