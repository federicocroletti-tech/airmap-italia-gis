export const environment = {
  production: false,
  appName: 'AIRMAP ITALIA',
  defaultLanguage: 'it',
  defaultTheme: 'light' as const,
  apiBaseUrl: '/api',
  geoJsonUrl: '/assets/mock/air-quality-areas.geojson',
  mapLayersUrl: '/assets/mock/map-layers.json',
  sensorsUrl: '/assets/mock/sensors.json',
  airQualityHistoryUrl: '/assets/mock/air-quality-history.json',
  dashboardSummaryUrl: '/assets/mock/dashboard-summary.json',
  initialMapView: {
    lat: 45.4642,
    lng: 9.19,
    zoom: 11,
  },
};
