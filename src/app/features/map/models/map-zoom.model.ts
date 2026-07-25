export type MapZoomDetailLevel = 'simplified' | 'standard' | 'detailed';

export interface MapViewState {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  detailLevel: MapZoomDetailLevel;
}
