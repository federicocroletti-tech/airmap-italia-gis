import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppFeatureState } from './app.state';

export const selectAppState = createFeatureSelector<AppFeatureState>('app');

export const selectAirQualityState = createSelector(selectAppState, (state) => state.airQuality);
export const selectAirQualityAreas = createSelector(selectAirQualityState, (state) => state.areas);
export const selectAirQualityLoading = createSelector(
  selectAirQualityState,
  (state) => state.loading,
);
export const selectAirQualityError = createSelector(selectAirQualityState, (state) => state.error);
export const selectSelectedAreaId = createSelector(
  selectAirQualityState,
  (state) => state.selectedAreaId,
);
export const selectSelectedArea = createSelector(
  selectAirQualityAreas,
  selectSelectedAreaId,
  (areas, selectedAreaId) => areas.find((area) => area.id === selectedAreaId) ?? null,
);
export const selectSelectedAreaHistory = createSelector(
  selectAirQualityState,
  (state) => state.selectedAreaHistory,
);

export const selectMapState = createSelector(selectAppState, (state) => state.map);
export const selectMapZoom = createSelector(selectMapState, (state) => state.zoom);
export const selectMapDetailLevel = createSelector(selectMapState, (state) => state.detailLevel);

export const selectLayerState = createSelector(selectAppState, (state) => state.layers);
export const selectLayers = createSelector(selectLayerState, (state) => state.items);
export const selectVisibleLayers = createSelector(selectLayers, (layers) =>
  layers.filter((layer) => layer.visible),
);

export const selectSensorsState = createSelector(selectAppState, (state) => state.sensors);
export const selectSensors = createSelector(selectSensorsState, (state) => state.items);
export const selectActiveSensors = createSelector(selectSensors, (sensors) =>
  sensors.filter((sensor) => sensor.active),
);

export const selectDashboardState = createSelector(selectAppState, (state) => state.dashboard);
export const selectDashboardData = createSelector(selectDashboardState, (state) => state.data);
export const selectDashboardLoading = createSelector(
  selectDashboardState,
  (state) => state.loading,
);

export const selectAnalyticsState = createSelector(selectAppState, (state) => state.analytics);
export const selectAnalyticsFilters = createSelector(
  selectAnalyticsState,
  (state) => state.filters,
);

export const selectSettingsState = createSelector(selectAppState, (state) => state.settings);
export const selectLanguage = createSelector(selectSettingsState, (state) => state.language);
export const selectTheme = createSelector(selectSettingsState, (state) => state.theme);
