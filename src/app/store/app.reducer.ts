import { createReducer, on } from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as AppActions from './app.actions';
import { AppFeatureState } from './app.state';

export const initialAppState: AppFeatureState = {
  airQuality: {
    areas: [],
    selectedAreaId: null,
    selectedAreaHistory: [],
    loading: false,
    error: null,
  },
  map: {
    center: {
      lat: environment.initialMapView.lat,
      lng: environment.initialMapView.lng,
    },
    zoom: environment.initialMapView.zoom,
    detailLevel: 'standard',
  },
  layers: {
    items: [],
    loading: false,
    error: null,
  },
  sensors: {
    items: [],
    loading: false,
    error: null,
  },
  dashboard: {
    data: null,
    loading: false,
    error: null,
  },
  analytics: {
    filters: {
      district: null,
      pollutionLevel: null,
      timeRange: '24h',
      indicator: 'aqi',
    },
  },
  settings: {
    language: 'it',
    theme: environment.defaultTheme,
  },
};

export const appReducer = createReducer(
  initialAppState,
  on(AppActions.loadAirQualityAreas, (state) => ({
    ...state,
    airQuality: { ...state.airQuality, loading: true, error: null },
  })),
  on(AppActions.loadAirQualityAreasSuccess, (state, { areas }) => ({
    ...state,
    airQuality: { ...state.airQuality, areas, loading: false, error: null },
  })),
  on(AppActions.loadAirQualityAreasFailure, (state, { error }) => ({
    ...state,
    airQuality: { ...state.airQuality, loading: false, error },
  })),
  on(AppActions.selectAirQualityArea, (state, { areaId }) => ({
    ...state,
    airQuality: {
      ...state.airQuality,
      selectedAreaId: areaId,
      selectedAreaHistory: areaId ? state.airQuality.selectedAreaHistory : [],
    },
  })),
  on(AppActions.loadAreaHistorySuccess, (state, { history }) => ({
    ...state,
    airQuality: { ...state.airQuality, selectedAreaHistory: history },
  })),
  on(AppActions.loadAreaHistoryFailure, (state, { error }) => ({
    ...state,
    airQuality: { ...state.airQuality, error },
  })),
  on(AppActions.updateMapZoom, (state, { zoom, detailLevel }) => ({
    ...state,
    map: { ...state.map, zoom, detailLevel },
  })),
  on(AppActions.updateMapCenter, (state, { lat, lng }) => ({
    ...state,
    map: { ...state.map, center: { lat, lng } },
  })),
  on(AppActions.loadLayers, (state) => ({
    ...state,
    layers: { ...state.layers, loading: true, error: null },
  })),
  on(AppActions.loadLayersSuccess, (state, { layers }) => ({
    ...state,
    layers: { items: layers, loading: false, error: null },
  })),
  on(AppActions.loadLayersFailure, (state, { error }) => ({
    ...state,
    layers: { ...state.layers, loading: false, error },
  })),
  on(AppActions.toggleLayer, (state, { layerId, visible }) => ({
    ...state,
    layers: {
      ...state.layers,
      items: state.layers.items.map((layer) =>
        layer.id === layerId ? { ...layer, visible } : layer,
      ),
    },
  })),
  on(AppActions.updateLayerOpacity, (state, { layerId, opacity }) => ({
    ...state,
    layers: {
      ...state.layers,
      items: state.layers.items.map((layer) =>
        layer.id === layerId ? { ...layer, opacity } : layer,
      ),
    },
  })),
  on(AppActions.loadSensors, (state) => ({
    ...state,
    sensors: { ...state.sensors, loading: true, error: null },
  })),
  on(AppActions.loadSensorsSuccess, (state, { sensors }) => ({
    ...state,
    sensors: { items: sensors, loading: false, error: null },
  })),
  on(AppActions.loadSensorsFailure, (state, { error }) => ({
    ...state,
    sensors: { ...state.sensors, loading: false, error },
  })),
  on(AppActions.loadDashboard, (state) => ({
    ...state,
    dashboard: { ...state.dashboard, loading: true, error: null },
  })),
  on(AppActions.loadDashboardSuccess, (state, { data }) => ({
    ...state,
    dashboard: { data, loading: false, error: null },
  })),
  on(AppActions.loadDashboardFailure, (state, { error }) => ({
    ...state,
    dashboard: { ...state.dashboard, loading: false, error },
  })),
  on(AppActions.updateAnalyticsFilters, (state, { filters }) => ({
    ...state,
    analytics: { filters: { ...state.analytics.filters, ...filters } },
  })),
  on(AppActions.setLanguage, (state, { language }) => ({
    ...state,
    settings: { ...state.settings, language },
  })),
  on(AppActions.setTheme, (state, { theme }) => ({
    ...state,
    settings: { ...state.settings, theme },
  })),
);
