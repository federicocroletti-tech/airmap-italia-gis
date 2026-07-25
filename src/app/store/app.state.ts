import { AirQualityArea, HistoricalMetric } from '../features/air-quality/models/air-quality.model';
import { AnalyticsFilter } from '../features/analytics/models/analytics.model';
import { DashboardSummary } from '../features/dashboard/models/dashboard.model';
import { MapLayer } from '../features/layers/models/map-layer.model';
import { MapViewState } from '../features/map/models/map-zoom.model';
import { Sensor } from '../features/map/models/sensor.model';

export interface AppFeatureState {
  airQuality: {
    areas: AirQualityArea[];
    selectedAreaId: string | null;
    selectedAreaHistory: HistoricalMetric[];
    loading: boolean;
    error: string | null;
  };
  map: MapViewState;
  layers: {
    items: MapLayer[];
    loading: boolean;
    error: string | null;
  };
  sensors: {
    items: Sensor[];
    loading: boolean;
    error: string | null;
  };
  dashboard: {
    data: DashboardSummary | null;
    loading: boolean;
    error: string | null;
  };
  analytics: {
    filters: AnalyticsFilter;
  };
  settings: {
    language: 'it' | 'en';
    theme: 'light' | 'dark';
  };
}

export interface AppRootState {
  app: AppFeatureState;
}
