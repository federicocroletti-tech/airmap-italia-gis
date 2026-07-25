import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, delay } from 'rxjs';
import { AIRMAP_APP_CONFIG } from '../../../core/config/app.config';
import { DashboardSummary } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  getDashboardSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(AIRMAP_APP_CONFIG.dashboardSummaryUrl).pipe(delay(180));
  }
}
