import { Injectable } from '@angular/core';
import { MapZoomDetailLevel } from '../models/map-zoom.model';

@Injectable({ providedIn: 'root' })
export class MapZoomService {
  getPolygonWeightByZoom(zoom: number): number {
    if (zoom < 11) {
      return 1;
    }

    if (zoom > 13) {
      return 3;
    }

    return 2;
  }

  shouldShowLabels(zoom: number): boolean {
    return zoom >= 12;
  }

  shouldShowSensors(zoom: number): boolean {
    return zoom >= 11;
  }

  shouldShowDetailedTooltip(zoom: number): boolean {
    return zoom >= 11;
  }

  getDetailLevel(zoom: number): MapZoomDetailLevel {
    if (zoom < 11) {
      return 'simplified';
    }

    if (zoom > 13) {
      return 'detailed';
    }

    return 'standard';
  }

  getFillOpacityByZoom(zoom: number): number {
    if (zoom < 11) {
      return 0.34;
    }

    if (zoom > 13) {
      return 0.68;
    }

    return 0.52;
  }
}
