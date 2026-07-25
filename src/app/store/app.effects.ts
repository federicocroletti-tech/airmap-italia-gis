import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { AirQualityDataService } from '../features/air-quality/services/air-quality-data.service';
import { DashboardService } from '../features/dashboard/services/dashboard.service';
import { MapLayerService } from '../features/layers/services/map-layer.service';
import { SensorService } from '../features/map/services/sensor.service';
import * as AppActions from './app.actions';

@Injectable()
export class AppEffects {
  private readonly actions$ = inject(Actions);
  private readonly airQualityDataService = inject(AirQualityDataService);
  private readonly dashboardService = inject(DashboardService);
  private readonly mapLayerService = inject(MapLayerService);
  private readonly sensorService = inject(SensorService);

  readonly loadAreas$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadAirQualityAreas),
      switchMap(() =>
        this.airQualityDataService.getAreas().pipe(
          map((areas) => AppActions.loadAirQualityAreasSuccess({ areas })),
          catchError((error: Error) =>
            of(AppActions.loadAirQualityAreasFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  readonly loadSelectedAreaHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.selectAirQualityArea),
      switchMap(({ areaId }) => {
        if (!areaId) {
          return of(AppActions.loadAreaHistorySuccess({ history: [] }));
        }

        return this.airQualityDataService.getHistoricalAqi(areaId).pipe(
          map((history) => AppActions.loadAreaHistorySuccess({ history })),
          catchError((error: Error) =>
            of(AppActions.loadAreaHistoryFailure({ error: error.message })),
          ),
        );
      }),
    ),
  );

  readonly loadLayers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadLayers),
      switchMap(() =>
        this.mapLayerService.getLayers().pipe(
          map((layers) => AppActions.loadLayersSuccess({ layers })),
          catchError((error: Error) => of(AppActions.loadLayersFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  readonly loadSensors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadSensors),
      switchMap(() =>
        this.sensorService.getSensors().pipe(
          map((sensors) => AppActions.loadSensorsSuccess({ sensors })),
          catchError((error: Error) => of(AppActions.loadSensorsFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  readonly loadDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadDashboard),
      switchMap(() =>
        this.dashboardService.getDashboardSummary().pipe(
          map((data) => AppActions.loadDashboardSuccess({ data })),
          catchError((error: Error) =>
            of(AppActions.loadDashboardFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );
}
