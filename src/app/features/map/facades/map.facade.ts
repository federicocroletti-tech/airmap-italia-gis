import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AppActions from '../../../store/app.actions';
import * as AppSelectors from '../../../store/app.selectors';
import { AppRootState } from '../../../store/app.state';
import { MapZoomService } from '../services/map-zoom.service';

@Injectable({ providedIn: 'root' })
export class MapFacade {
  private readonly store = inject<Store<AppRootState>>(Store);
  private readonly mapZoomService = inject(MapZoomService);

  readonly mapState$ = this.store.select(AppSelectors.selectMapState);
  readonly zoom$ = this.store.select(AppSelectors.selectMapZoom);
  readonly detailLevel$ = this.store.select(AppSelectors.selectMapDetailLevel);
  readonly sensors$ = this.store.select(AppSelectors.selectSensors);
  readonly activeSensors$ = this.store.select(AppSelectors.selectActiveSensors);

  loadSensors(): void {
    this.store.dispatch(AppActions.loadSensors());
  }

  updateZoom(zoom: number): void {
    this.store.dispatch(
      AppActions.updateMapZoom({ zoom, detailLevel: this.mapZoomService.getDetailLevel(zoom) }),
    );
  }

  updateCenter(lat: number, lng: number): void {
    this.store.dispatch(AppActions.updateMapCenter({ lat, lng }));
  }
}
