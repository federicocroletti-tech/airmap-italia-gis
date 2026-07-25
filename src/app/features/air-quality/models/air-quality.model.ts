import { GeoJsonFeature } from '../../map/models/geo-json.model';

export type PollutionLevel = 'excellent' | 'good' | 'moderate' | 'high' | 'very-high' | 'critical';
export type AirQualityStatus = 'idle' | 'loading' | 'loaded' | 'error';
export type AreaTrend = 'up' | 'down' | 'stable';
export type RiskLevel = 'low' | 'attention' | 'warning' | 'danger';
export type AirQualityMetricKey = 'aqi' | 'pm10' | 'pm25' | 'no2' | 'o3' | 'co' | 'co2';

export interface AirQualityMetrics {
  aqi: number;
  pm10: number;
  pm25: number;
  no2: number;
  o3: number;
  co: number;
  co2: number;
  lastUpdate: string;
  trend: AreaTrend;
}

export interface AirQualityAreaProperties extends AirQualityMetrics {
  id: string;
  name: string;
  district: string;
  pollutionLevel: PollutionLevel;
  populationExposure: number;
  riskLevel: RiskLevel;
}

export interface AirQualityArea extends AirQualityAreaProperties {
  feature: GeoJsonFeature<AirQualityAreaProperties>;
}

export interface HistoricalMetric {
  timestamp: string;
  aqi: number;
  pm10: number;
  pm25: number;
  no2: number;
  o3: number;
  co: number;
  co2: number;
}
