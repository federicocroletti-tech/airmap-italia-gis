import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, delay, map } from 'rxjs';
import { AIRMAP_APP_CONFIG } from '../../../core/config/app.config';
import { GeoJsonFeatureCollection } from '../../map/models/geo-json.model';
import {
  AirQualityArea,
  AirQualityAreaProperties,
  HistoricalMetric,
} from '../models/air-quality.model';

@Injectable({ providedIn: 'root' })
export class AirQualityDataService {
  private readonly http = inject(HttpClient);

  getAreas(): Observable<AirQualityArea[]> {
    return this.http
      .get<GeoJsonFeatureCollection<AirQualityAreaProperties>>(AIRMAP_APP_CONFIG.geoJsonUrl)
      .pipe(
        delay(250),
        map((collection) =>
          collection.features.map((feature) => ({
            ...feature.properties,
            feature,
          })),
        ),
      );
  }

  getHistoricalAqi(areaId: string): Observable<HistoricalMetric[]> {
    return this.http
      .get<Record<string, HistoricalMetric[]>>(AIRMAP_APP_CONFIG.airQualityHistoryUrl)
      .pipe(
        delay(180),
        map((historyByArea) => historyByArea[areaId] ?? historyByArea['default'] ?? []),
      );
  }

  exportAreaAsJson(area: AirQualityArea): void {
    const blob = new Blob([JSON.stringify(area, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${area.id}-air-quality.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
}
