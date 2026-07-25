import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, delay } from 'rxjs';
import { AIRMAP_APP_CONFIG } from '../../../core/config/app.config';
import { MapLayer } from '../models/map-layer.model';

@Injectable({ providedIn: 'root' })
export class MapLayerService {
  private readonly http = inject(HttpClient);

  getLayers(): Observable<MapLayer[]> {
    return this.http.get<MapLayer[]>(AIRMAP_APP_CONFIG.mapLayersUrl).pipe(delay(160));
  }
}
