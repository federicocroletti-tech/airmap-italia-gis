export interface AnalyticsFilter {
  district: string | null;
  pollutionLevel: string | null;
  timeRange: '24h' | '7d' | '30d';
  indicator: 'aqi' | 'pm10' | 'pm25' | 'no2' | 'o3';
}

export interface AnalyticsRankingRow {
  id: string;
  name: string;
  district: string;
  aqi: number;
  pm10: number;
  pm25: number;
  no2: number;
  riskLevel: string;
  populationExposure: number;
}
