export type GeoJsonGeometryType =
  'Polygon' | 'MultiPolygon' | 'Point' | 'LineString' | 'MultiLineString';

export interface GeoJsonGeometry {
  type: GeoJsonGeometryType;
  coordinates: unknown;
}

export interface GeoJsonFeature<TProperties = Record<string, unknown>> {
  type: 'Feature';
  properties: TProperties;
  geometry: GeoJsonGeometry;
}

export interface GeoJsonFeatureCollection<TProperties = Record<string, unknown>> {
  type: 'FeatureCollection';
  features: Array<GeoJsonFeature<TProperties>>;
}
