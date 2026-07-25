import { Injectable } from '@angular/core';
import { AirQualityArea } from '../models/air-quality.model';

@Injectable({ providedIn: 'root' })
export class AirQualitySearchService {
  searchAreas(areas: AirQualityArea[], query: string): AirQualityArea[] {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    const coordinate = this.parseCoordinateQuery(normalizedQuery);

    if (coordinate) {
      return areas.filter((area) =>
        this.areaContainsCoordinate(area, coordinate.lat, coordinate.lng),
      );
    }

    return areas.filter((area) => {
      const values = [
        area.name,
        area.district,
        area.pollutionLevel,
        area.riskLevel,
        String(area.aqi),
      ];
      return values.some((value) => value.toLowerCase().includes(normalizedQuery));
    });
  }

  private parseCoordinateQuery(query: string): { lat: number; lng: number } | null {
    const match = query.match(/^\s*(?<lat>45\.\d+)\s*,\s*(?<lng>9\.\d+)\s*$/);

    if (!match?.groups) {
      return null;
    }

    return {
      lat: Number(match.groups['lat']),
      lng: Number(match.groups['lng']),
    };
  }

  private areaContainsCoordinate(area: AirQualityArea, lat: number, lng: number): boolean {
    const coordinatePairs: Array<{ lng: number; lat: number }> = [];
    this.collectCoordinatePairs(area.feature.geometry.coordinates, coordinatePairs);

    if (coordinatePairs.length === 0) {
      return false;
    }

    const latitudes = coordinatePairs.map((coordinatePair) => coordinatePair.lat);
    const longitudes = coordinatePairs.map((coordinatePair) => coordinatePair.lng);

    return (
      lat >= Math.min(...latitudes) &&
      lat <= Math.max(...latitudes) &&
      lng >= Math.min(...longitudes) &&
      lng <= Math.max(...longitudes)
    );
  }

  private collectCoordinatePairs(
    value: unknown,
    coordinatePairs: Array<{ lng: number; lat: number }>,
  ): void {
    if (!Array.isArray(value)) {
      return;
    }

    if (typeof value[0] === 'number' && typeof value[1] === 'number') {
      coordinatePairs.push({ lng: value[0], lat: value[1] });
      return;
    }

    value.forEach((item) => this.collectCoordinatePairs(item, coordinatePairs));
  }
}
