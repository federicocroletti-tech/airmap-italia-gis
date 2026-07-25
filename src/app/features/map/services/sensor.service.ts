import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, delay } from 'rxjs';
import { AIRMAP_APP_CONFIG } from '../../../core/config/app.config';
import { Sensor } from '../models/sensor.model';

@Injectable({ providedIn: 'root' })
export class SensorService {
  private readonly http = inject(HttpClient);

  getSensors(): Observable<Sensor[]> {
    return this.http.get<Sensor[]>(AIRMAP_APP_CONFIG.sensorsUrl).pipe(delay(140));
  }
}
