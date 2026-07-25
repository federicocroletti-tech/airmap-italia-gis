import { HistoricalMetric } from '../../air-quality/models/air-quality.model';

export interface DashboardKpi {
  id: string;
  labelKey: string;
  value: string | number;
  helper: string;
  helperKey?: string;
  status: 'good' | 'warning' | 'danger' | 'neutral';
}

export interface DashboardSummary {
  kpis: DashboardKpi[];
  historicalMetrics: HistoricalMetric[];
  districtComparison: Array<{ district: string; aqi: number }>;
  pollutionDistribution: Array<{ level: string; count: number }>;
}
