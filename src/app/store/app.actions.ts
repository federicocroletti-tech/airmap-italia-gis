import { createAction, props } from '@ngrx/store';
import { AirQualityArea, HistoricalMetric } from '../features/air-quality/models/air-quality.model';
import { AnalyticsFilter } from '../features/analytics/models/analytics.model';
import { DashboardSummary } from '../features/dashboard/models/dashboard.model';
import { MapLayer } from '../features/layers/models/map-layer.model';
import { MapZoomDetailLevel } from '../features/map/models/map-zoom.model';
import { Sensor } from '../features/map/models/sensor.model';

export const loadAirQualityAreas = createAction('[Air Quality] Load Areas');
export const loadAirQualityAreasSuccess = createAction(
  '[Air Quality] Load Areas Success',
  props<{ areas: AirQualityArea[] }>(),
);
export const loadAirQualityAreasFailure = createAction(
  '[Air Quality] Load Areas Failure',
  props<{ error: string }>(),
);

export const selectAirQualityArea = createAction(
  '[Air Quality] Select Area',
  props<{ areaId: string | null }>(),
);
export const loadAreaHistorySuccess = createAction(
  '[Air Quality] Load Area History Success',
  props<{ history: HistoricalMetric[] }>(),
);
export const loadAreaHistoryFailure = createAction(
  '[Air Quality] Load Area History Failure',
  props<{ error: string }>(),
);

export const updateMapZoom = createAction(
  '[Map] Update Zoom',
  props<{ zoom: number; detailLevel: MapZoomDetailLevel }>(),
);
export const updateMapCenter = createAction(
  '[Map] Update Center',
  props<{ lat: number; lng: number }>(),
);

export const loadLayers = createAction('[Layers] Load Layers');
export const loadLayersSuccess = createAction(
  '[Layers] Load Layers Success',
  props<{ layers: MapLayer[] }>(),
);
export const loadLayersFailure = createAction(
  '[Layers] Load Layers Failure',
  props<{ error: string }>(),
);
export const toggleLayer = createAction(
  '[Layers] Toggle Layer',
  props<{ layerId: string; visible: boolean }>(),
);
export const updateLayerOpacity = createAction(
  '[Layers] Update Opacity',
  props<{ layerId: string; opacity: number }>(),
);

export const loadSensors = createAction('[Sensors] Load Sensors');
export const loadSensorsSuccess = createAction(
  '[Sensors] Load Sensors Success',
  props<{ sensors: Sensor[] }>(),
);
export const loadSensorsFailure = createAction(
  '[Sensors] Load Sensors Failure',
  props<{ error: string }>(),
);

export const loadDashboard = createAction('[Dashboard] Load');
export const loadDashboardSuccess = createAction(
  '[Dashboard] Load Success',
  props<{ data: DashboardSummary }>(),
);
export const loadDashboardFailure = createAction(
  '[Dashboard] Load Failure',
  props<{ error: string }>(),
);

export const updateAnalyticsFilters = createAction(
  '[Analytics] Update Filters',
  props<{ filters: Partial<AnalyticsFilter> }>(),
);

export const setLanguage = createAction(
  '[Settings] Set Language',
  props<{ language: 'it' | 'en' }>(),
);
export const setTheme = createAction('[Settings] Set Theme', props<{ theme: 'light' | 'dark' }>());
