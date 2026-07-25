import { AIRMAP_APP_CONFIG } from '../config/app.config';

export const MILAN_INITIAL_VIEW = AIRMAP_APP_CONFIG.initialMapView;

export const MAP_TILE_ATTRIBUTION = '&copy; OpenStreetMap contributors';

export const MAP_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

export const AQI_THRESHOLDS = {
  excellent: 50,
  moderate: 100,
  high: 150,
  veryHigh: 200,
};
