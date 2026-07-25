import { Injectable } from '@angular/core';
import { AirQualityArea } from '../../air-quality/models/air-quality.model';
import { AnalyticsFilter, AnalyticsRankingRow } from '../models/analytics.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  toRankingRows(areas: AirQualityArea[], filters: AnalyticsFilter): AnalyticsRankingRow[] {
    return areas
      .filter((area) => !filters.district || area.district === filters.district)
      .filter((area) => !filters.pollutionLevel || area.pollutionLevel === filters.pollutionLevel)
      .map((area) => ({
        id: area.id,
        name: area.name,
        district: area.district,
        aqi: area.aqi,
        pm10: area.pm10,
        pm25: area.pm25,
        no2: area.no2,
        riskLevel: area.riskLevel,
        populationExposure: area.populationExposure,
      }));
  }

  getAverageAqiByDistrict(areas: AirQualityArea[]): Array<{ district: string; aqi: number }> {
    const grouped = areas.reduce<Record<string, { total: number; count: number }>>(
      (accumulator, area) => {
        accumulator[area.district] ??= { total: 0, count: 0 };
        accumulator[area.district].total += area.aqi;
        accumulator[area.district].count += 1;
        return accumulator;
      },
      {},
    );

    return Object.entries(grouped).map(([district, value]) => ({
      district,
      aqi: Math.round(value.total / value.count),
    }));
  }
}
