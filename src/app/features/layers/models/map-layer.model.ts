import { AirQualityMetricKey } from '../../air-quality/models/air-quality.model';

export type MapLayerType = 'geojson' | 'wms' | 'wfs' | 'heatmap' | 'markers' | 'raster' | 'vector';

export interface BaseLayerConfig {
  id: string;
  name: string;
  type: MapLayerType;
  visible: boolean;
  opacity: number;
  configurable: boolean;
  labelKey?: string;
  metricKey?: AirQualityMetricKey;
  unit?: string;
  description?: string;
}

export interface WmsLayerConfig extends BaseLayerConfig {
  type: 'wms';
  url: string;
  layers: string;
  format?: string;
  transparent?: boolean;
}

export interface WfsLayerConfig extends BaseLayerConfig {
  type: 'wfs';
  url: string;
  typeName: string;
  outputFormat?: string;
}

export type MapLayer = BaseLayerConfig | WmsLayerConfig | WfsLayerConfig;
