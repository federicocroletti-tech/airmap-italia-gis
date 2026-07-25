import { Injectable, inject } from '@angular/core';
import { PathOptions } from 'leaflet';
import { AQI_THRESHOLDS } from '../../../core/constants/map.constants';
import { AirQualityArea, AirQualityMetricKey, PollutionLevel } from '../models/air-quality.model';
import { MapZoomService } from '../../map/services/map-zoom.service';

@Injectable({ providedIn: 'root' })
export class AirQualityStyleService {
  private readonly mapZoomService = inject(MapZoomService);

  getColorByAqi(aqi: number): string {
    if (aqi <= AQI_THRESHOLDS.excellent) {
      return '#2e7d32';
    }

    if (aqi <= AQI_THRESHOLDS.moderate) {
      return '#f5c542';
    }

    if (aqi <= AQI_THRESHOLDS.high) {
      return '#ef8f2f';
    }

    if (aqi <= AQI_THRESHOLDS.veryHigh) {
      return '#d84343';
    }

    return '#7b3f98';
  }

  getBorderColorByAqi(aqi: number): string {
    if (aqi <= AQI_THRESHOLDS.excellent) {
      return '#1b5e20';
    }

    if (aqi <= AQI_THRESHOLDS.moderate) {
      return '#b88700';
    }

    if (aqi <= AQI_THRESHOLDS.high) {
      return '#b65f00';
    }

    if (aqi <= AQI_THRESHOLDS.veryHigh) {
      return '#9f1f1f';
    }

    return '#4a2362';
  }

  getOpacityByAqi(aqi: number): number {
    if (aqi <= AQI_THRESHOLDS.excellent) {
      return 0.42;
    }

    if (aqi <= AQI_THRESHOLDS.moderate) {
      return 0.5;
    }

    if (aqi <= AQI_THRESHOLDS.high) {
      return 0.58;
    }

    return 0.66;
  }

  getPollutionLevelByAqi(aqi: number): PollutionLevel {
    if (aqi <= AQI_THRESHOLDS.excellent) {
      return 'excellent';
    }

    if (aqi <= AQI_THRESHOLDS.moderate) {
      return 'moderate';
    }

    if (aqi <= AQI_THRESHOLDS.high) {
      return 'high';
    }

    if (aqi <= AQI_THRESHOLDS.veryHigh) {
      return 'very-high';
    }

    return 'critical';
  }

  getPolygonStyle(
    area: AirQualityArea,
    zoom: number,
    metricKey: AirQualityMetricKey = 'aqi',
  ): PathOptions & { className: string } {
    const value = area[metricKey];
    const color = this.getColorByMetric(metricKey, value);

    return {
      fillColor: color,
      color: this.getBorderColorByMetric(metricKey, value),
      weight: this.mapZoomService.getPolygonWeightByZoom(zoom),
      opacity: 0.92,
      fillOpacity: Math.max(
        this.getOpacityByMetric(metricKey, value),
        this.mapZoomService.getFillOpacityByZoom(zoom),
      ),
      className: `air-quality-polygon metric-${metricKey} aqi-${this.getPollutionLevelByAqi(area.aqi)}`,
    };
  }

  getColorByMetric(metricKey: AirQualityMetricKey, value: number): string {
    if (metricKey === 'aqi') {
      return this.getColorByAqi(value);
    }

    const normalized = this.normalizeMetric(metricKey, value);
    return this.getColorByAqi(normalized);
  }

  getBorderColorByMetric(metricKey: AirQualityMetricKey, value: number): string {
    if (metricKey === 'aqi') {
      return this.getBorderColorByAqi(value);
    }

    return this.getBorderColorByAqi(this.normalizeMetric(metricKey, value));
  }

  getOpacityByMetric(metricKey: AirQualityMetricKey, value: number): number {
    if (metricKey === 'aqi') {
      return this.getOpacityByAqi(value);
    }

    return this.getOpacityByAqi(this.normalizeMetric(metricKey, value));
  }

  private normalizeMetric(metricKey: Exclude<AirQualityMetricKey, 'aqi'>, value: number): number {
    const ranges: Record<Exclude<AirQualityMetricKey, 'aqi'>, [number, number, number, number]> = {
      pm10: [20, 40, 60, 80],
      pm25: [10, 20, 35, 50],
      no2: [20, 40, 70, 100],
      o3: [50, 80, 120, 180],
      co: [0.4, 0.8, 1.2, 1.8],
      co2: [420, 520, 650, 800],
    };
    const [excellent, moderate, high, veryHigh] = ranges[metricKey];

    if (value <= excellent) {
      return 40;
    }

    if (value <= moderate) {
      return 85;
    }

    if (value <= high) {
      return 130;
    }

    if (value <= veryHigh) {
      return 175;
    }

    return 220;
  }

  getBadgeColor(level: PollutionLevel): string {
    const colors: Record<PollutionLevel, string> = {
      excellent: '#2e7d32',
      good: '#6aa84f',
      moderate: '#f5c542',
      high: '#ef8f2f',
      'very-high': '#d84343',
      critical: '#7b3f98',
    };

    return colors[level];
  }
}
