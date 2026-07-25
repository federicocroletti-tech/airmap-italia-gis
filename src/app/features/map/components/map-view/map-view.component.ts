import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import * as L from 'leaflet';
import {
  MILAN_INITIAL_VIEW,
  MAP_TILE_ATTRIBUTION,
  MAP_TILE_URL,
} from '../../../../core/constants/map.constants';
import { AirQualityArea } from '../../../air-quality/models/air-quality.model';
import { AirQualityStyleService } from '../../../air-quality/services/air-quality-style.service';
import { MapLayer } from '../../../layers/models/map-layer.model';
import { Sensor } from '../../models/sensor.model';
import { MapZoomService } from '../../services/map-zoom.service';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, TranslatePipe],
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapViewComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() areas: AirQualityArea[] = [];
  @Input() layers: MapLayer[] = [];
  @Input() sensors: Sensor[] = [];
  @Input() selectedArea: AirQualityArea | null = null;

  @Output() areaSelected = new EventEmitter<AirQualityArea>();
  @Output() zoomChanged = new EventEmitter<number>();
  @Output() centerChanged = new EventEmitter<{ lat: number; lng: number }>();

  @ViewChild('mapContainer', { static: true })
  private readonly mapContainer!: ElementRef<HTMLDivElement>;

  private readonly styleService = inject(AirQualityStyleService);
  private readonly zoomService = inject(MapZoomService);
  private readonly translateService = inject(TranslateService);

  private map?: L.Map;
  private airQualityLayer?: L.GeoJSON;
  private sensorLayer?: L.LayerGroup;
  private resizeObserver?: ResizeObserver;
  private currentZoom = MILAN_INITIAL_VIEW.zoom;

  ngAfterViewInit(): void {
    this.initializeMap();
    this.renderAirQualityLayer();
    this.renderSensorLayer();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.map) {
      return;
    }

    if (changes['areas'] || changes['layers']) {
      this.renderAirQualityLayer();
    }

    if (changes['sensors'] || changes['layers']) {
      this.renderSensorLayer();
    }

    if (changes['selectedArea']) {
      this.focusSelectedArea();
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.airQualityLayer?.clearLayers();
    this.sensorLayer?.clearLayers();
    this.map?.off();
    this.map?.remove();
    this.map = undefined;
  }

  resetView(): void {
    this.map?.setView([MILAN_INITIAL_VIEW.lat, MILAN_INITIAL_VIEW.lng], MILAN_INITIAL_VIEW.zoom);
  }

  toggleFullscreen(): void {
    const element = this.mapContainer.nativeElement;

    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }

    void element.requestFullscreen();
  }

  private initializeMap(): void {
    this.map = L.map(this.mapContainer.nativeElement, {
      center: [MILAN_INITIAL_VIEW.lat, MILAN_INITIAL_VIEW.lng],
      zoom: MILAN_INITIAL_VIEW.zoom,
      zoomControl: true,
      preferCanvas: true,
    });

    const openStreetMapLayer = L.tileLayer(MAP_TILE_URL, {
      attribution: MAP_TILE_ATTRIBUTION,
      maxZoom: 19,
    }).addTo(this.map);

    L.control
      .layers({ OpenStreetMap: openStreetMapLayer }, undefined, {
        position: 'topright',
        collapsed: true,
      })
      .addTo(this.map);
    L.control.scale({ metric: true, imperial: false }).addTo(this.map);

    this.map.on('zoomend', () => {
      this.currentZoom = this.map?.getZoom() ?? MILAN_INITIAL_VIEW.zoom;
      this.zoomChanged.emit(this.currentZoom);
      this.updateAirQualityStyles();
      this.renderSensorLayer();
    });

    this.map.on('moveend', () => {
      const center = this.map?.getCenter();

      if (center) {
        this.centerChanged.emit({ lat: center.lat, lng: center.lng });
      }
    });

    this.resizeObserver = new ResizeObserver(() => this.map?.invalidateSize());
    this.resizeObserver.observe(this.mapContainer.nativeElement);
  }

  private renderAirQualityLayer(): void {
    if (!this.map) {
      return;
    }

    this.airQualityLayer?.removeFrom(this.map);
    this.airQualityLayer?.clearLayers();
    this.airQualityLayer = undefined;

    const activeLayer = this.getAirQualityZonesLayer();

    if (!activeLayer || this.areas.length === 0) {
      return;
    }

    const collection = {
      type: 'FeatureCollection',
      features: this.areas.map((area) => area.feature),
    } as GeoJSON.FeatureCollection;

    this.airQualityLayer = L.geoJSON(collection, {
      style: (feature) => {
        const area = this.findAreaFromFeature(feature);
        return area ? this.getAreaStyle(area, activeLayer) : {};
      },
      onEachFeature: (feature, layer) => {
        const area = this.findAreaFromFeature(feature);

        if (!area) {
          return;
        }

        layer.bindTooltip(this.getTooltipContent(area, activeLayer), {
          sticky: this.zoomService.shouldShowDetailedTooltip(this.currentZoom),
          direction: 'top',
          className: 'airmap-tooltip',
          opacity: 0.96,
        });

        layer.on({
          mouseover: () => this.highlightLayer(layer, area, activeLayer),
          mouseout: () => this.resetLayerStyle(layer, area, activeLayer),
          click: () => this.areaSelected.emit(area),
        });
      },
    }).addTo(this.map);

    this.focusSelectedArea();
  }

  private renderSensorLayer(): void {
    if (!this.map) {
      return;
    }

    this.sensorLayer?.removeFrom(this.map);
    this.sensorLayer?.clearLayers();
    this.sensorLayer = undefined;

    if (!this.isLayerVisible('sensors') || !this.zoomService.shouldShowSensors(this.currentZoom)) {
      return;
    }

    const sensorOpacity = this.getLayerOpacity('sensors');

    this.sensorLayer = L.layerGroup(
      this.sensors.map((sensor) =>
        L.circleMarker([sensor.lat, sensor.lng], {
          radius: sensor.active ? 6 : 4,
          color: sensor.active ? '#176b87' : '#7b8794',
          fillColor: sensor.active ? '#1b998b' : '#a8b3bd',
          fillOpacity: (sensor.active ? 0.92 : 0.55) * sensorOpacity,
          opacity: sensorOpacity,
          weight: 2,
        }).bindTooltip(
          `${sensor.name}<br />AQI ${sensor.metrics.aqi}<br />PM10 ${sensor.metrics.pm10} ug/m3`,
          {
            className: 'airmap-tooltip',
          },
        ),
      ),
    ).addTo(this.map);
  }

  private updateAirQualityStyles(): void {
    this.airQualityLayer?.eachLayer((layer) => {
      const feature = (layer as L.Layer & { feature?: GeoJSON.Feature }).feature;
      const area = this.findAreaFromFeature(feature);
      const activeLayer = this.getAirQualityZonesLayer();

      if (area && activeLayer && layer instanceof L.Path) {
        layer.setStyle(this.getAreaStyle(area, activeLayer));
      }
    });
  }

  private focusSelectedArea(): void {
    const selectedArea = this.selectedArea;

    if (!this.map || !this.airQualityLayer || !selectedArea) {
      return;
    }

    this.airQualityLayer.eachLayer((layer) => {
      const feature = (layer as L.Layer & { feature?: GeoJSON.Feature }).feature;
      const area = this.findAreaFromFeature(feature);

      if (!area || area.id !== selectedArea.id) {
        return;
      }

      if (layer instanceof L.Polygon) {
        this.map?.fitBounds(layer.getBounds(), { padding: [30, 30], maxZoom: 14 });
      }

      const activeLayer = this.getAirQualityZonesLayer();

      if (activeLayer) {
        this.highlightLayer(layer, area, activeLayer);
      }
      layer.openTooltip();
    });
  }

  private highlightLayer(layer: L.Layer, area: AirQualityArea, activeLayer: MapLayer): void {
    if (!(layer instanceof L.Path)) {
      return;
    }

    const baseStyle = this.getAreaStyle(area, activeLayer);
    layer.setStyle({
      ...baseStyle,
      weight: Number(baseStyle.weight ?? 2) + 2,
      fillOpacity: Math.min(Number(baseStyle.fillOpacity ?? 0.55) + 0.14, 0.86),
    });
    layer.bringToFront();
  }

  private resetLayerStyle(layer: L.Layer, area: AirQualityArea, activeLayer: MapLayer): void {
    if (layer instanceof L.Path && area.id !== this.selectedArea?.id) {
      layer.setStyle(this.getAreaStyle(area, activeLayer));
    }
  }

  private getAreaStyle(
    area: AirQualityArea,
    activeLayer: MapLayer,
  ): L.PathOptions & { className: string } {
    const metricKey = activeLayer.metricKey ?? 'aqi';
    const baseStyle = this.styleService.getPolygonStyle(area, this.currentZoom, metricKey);
    const opacity = activeLayer.opacity;

    return {
      ...baseStyle,
      fillOpacity: Number(baseStyle.fillOpacity ?? 0.5) * opacity,
    };
  }

  private getTooltipContent(area: AirQualityArea, activeLayer: MapLayer): string {
    const compact = !this.zoomService.shouldShowDetailedTooltip(this.currentZoom);
    const metricKey = activeLayer.metricKey ?? 'aqi';
    const metricValue = area[metricKey];
    const metricLabel = this.translateService.instant(this.getMetricLabelKey(metricKey));
    const qualityLabel = this.translateService.instant('AIR_QUALITY.LEVEL');

    if (compact) {
      return `<strong>${area.name}</strong><br />${metricLabel}: ${metricValue}${this.getMetricUnit(metricKey)}`;
    }

    return `<strong>${area.name}</strong><br />${metricLabel}: ${metricValue}${this.getMetricUnit(metricKey)}<br />${qualityLabel}: ${this.getPollutionLevelLabel(area.pollutionLevel)}`;
  }

  private getMetricLabelKey(metricKey: NonNullable<MapLayer['metricKey']>): string {
    const labelKeys: Record<NonNullable<MapLayer['metricKey']>, string> = {
      aqi: 'LAYERS.AQI',
      pm10: 'LAYERS.PM10',
      pm25: 'LAYERS.PM25',
      no2: 'LAYERS.NO2',
      o3: 'LAYERS.O3',
      co: 'LAYERS.CO',
      co2: 'LAYERS.CO2',
    };

    return labelKeys[metricKey];
  }

  private getMetricUnit(metricKey: NonNullable<MapLayer['metricKey']>): string {
    const units: Record<NonNullable<MapLayer['metricKey']>, string> = {
      aqi: '',
      pm10: ' ug/m3',
      pm25: ' ug/m3',
      no2: ' ug/m3',
      o3: ' ug/m3',
      co: ' mg/m3',
      co2: ' ppm',
    };

    return units[metricKey];
  }

  private getPollutionLevelLabel(level: AirQualityArea['pollutionLevel']): string {
    const labelKeys: Record<AirQualityArea['pollutionLevel'], string> = {
      excellent: 'AIR_QUALITY.LEVEL_EXCELLENT',
      good: 'AIR_QUALITY.LEVEL_GOOD',
      moderate: 'AIR_QUALITY.LEVEL_MODERATE',
      high: 'AIR_QUALITY.LEVEL_HIGH',
      'very-high': 'AIR_QUALITY.LEVEL_VERY_HIGH',
      critical: 'AIR_QUALITY.LEVEL_CRITICAL',
    };

    return this.translateService.instant(labelKeys[level]);
  }

  private findAreaFromFeature(feature: GeoJSON.Feature | undefined): AirQualityArea | undefined {
    const id = feature?.properties?.['id'];
    return typeof id === 'string' ? this.areas.find((area) => area.id === id) : undefined;
  }

  private isLayerVisible(layerId: string): boolean {
    return this.layers.find((layer) => layer.id === layerId)?.visible ?? false;
  }

  private getLayerOpacity(layerId: string): number {
    return this.layers.find((layer) => layer.id === layerId)?.opacity ?? 1;
  }

  private getAirQualityZonesLayer(): MapLayer | null {
    if (this.layers.length === 0) {
      return {
        id: 'air-quality-zones',
        name: 'Zone qualità aria',
        type: 'geojson',
        visible: true,
        opacity: 0.72,
        configurable: true,
        metricKey: 'aqi',
      };
    }

    return this.layers.find((layer) => layer.id === 'air-quality-zones' && layer.visible) ?? null;
  }
}
