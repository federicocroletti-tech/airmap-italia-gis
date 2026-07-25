import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AreaDetailPanelComponent } from '../../air-quality/components/area-detail-panel/area-detail-panel.component';
import { AirQualityArea } from '../../air-quality/models/air-quality.model';
import { AirQualityFacade } from '../../air-quality/facades/air-quality.facade';
import { LayerPanelComponent } from '../../layers/components/layer-panel/layer-panel.component';
import { LayerFacade } from '../../layers/facades/layer.facade';
import { MapSearchComponent } from '../components/map-search/map-search.component';
import { MapViewComponent } from '../components/map-view/map-view.component';
import { MapFacade } from '../facades/map.facade';

@Component({
  selector: 'app-map-page',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    TranslatePipe,
    AreaDetailPanelComponent,
    LayerPanelComponent,
    MapSearchComponent,
    MapViewComponent,
  ],
  templateUrl: './map-page.component.html',
  styleUrl: './map-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapPageComponent implements OnInit {
  private readonly airQualityFacade = inject(AirQualityFacade);
  private readonly layerFacade = inject(LayerFacade);
  private readonly mapFacade = inject(MapFacade);
  private readonly router = inject(Router);

  readonly areas = toSignal(this.airQualityFacade.areas$, { initialValue: [] });
  readonly selectedArea = toSignal(this.airQualityFacade.selectedArea$, { initialValue: null });
  readonly selectedAreaHistory = toSignal(this.airQualityFacade.selectedAreaHistory$, {
    initialValue: [],
  });
  readonly layers = toSignal(this.layerFacade.layers$, { initialValue: [] });
  readonly sensors = toSignal(this.mapFacade.activeSensors$, { initialValue: [] });
  readonly loading = toSignal(this.airQualityFacade.loading$, { initialValue: false });
  readonly hasSelectedArea = computed(() => this.selectedArea() !== null);

  ngOnInit(): void {
    this.airQualityFacade.loadAreas();
    this.layerFacade.loadLayers();
    this.mapFacade.loadSensors();
  }

  selectArea(area: AirQualityArea): void {
    this.airQualityFacade.selectArea(area.id);
  }

  closeDetails(): void {
    this.airQualityFacade.selectArea(null);
  }

  updateLayer(event: { layerId: string; visible: boolean }): void {
    this.layerFacade.toggleLayer(event.layerId, event.visible);
  }

  updateOpacity(event: { layerId: string; opacity: number }): void {
    this.layerFacade.updateOpacity(event.layerId, event.opacity);
  }

  updateZoom(zoom: number): void {
    this.mapFacade.updateZoom(zoom);
  }

  updateCenter(center: { lat: number; lng: number }): void {
    this.mapFacade.updateCenter(center.lat, center.lng);
  }

  analyzeArea(area: AirQualityArea): void {
    void this.router.navigate(['/analytics'], { queryParams: { area: area.id } });
  }

  exportArea(area: AirQualityArea): void {
    this.airQualityFacade.exportArea(area);
  }
}
