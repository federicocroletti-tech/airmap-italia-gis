import { environment } from '../../../environments/environment';

export const AIRMAP_APP_CONFIG = {
  name: environment.appName,
  apiBaseUrl: environment.apiBaseUrl,
  geoJsonUrl: environment.geoJsonUrl,
  mapLayersUrl: environment.mapLayersUrl,
  sensorsUrl: environment.sensorsUrl,
  airQualityHistoryUrl: environment.airQualityHistoryUrl,
  dashboardSummaryUrl: environment.dashboardSummaryUrl,
  supportedLanguages: ['it', 'en'] as const,
  defaultLanguage: environment.defaultLanguage,
  defaultTheme: environment.defaultTheme,
  initialMapView: environment.initialMapView,
  geoserver: {
    wmsUrl: 'https://example-geoserver.com/geoserver/wms',
    wfsUrl: 'https://example-geoserver.com/geoserver/wfs',
  },
};

export type SupportedLanguage = (typeof AIRMAP_APP_CONFIG.supportedLanguages)[number];
export type AppTheme = 'light' | 'dark';
