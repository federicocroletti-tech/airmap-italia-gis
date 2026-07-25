import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AppActions from '../../../store/app.actions';
import * as AppSelectors from '../../../store/app.selectors';
import { AppRootState } from '../../../store/app.state';

@Injectable({ providedIn: 'root' })
export class LayerFacade {
  private readonly store = inject<Store<AppRootState>>(Store);

  readonly layers$ = this.store.select(AppSelectors.selectLayers);
  readonly visibleLayers$ = this.store.select(AppSelectors.selectVisibleLayers);

  loadLayers(): void {
    this.store.dispatch(AppActions.loadLayers());
  }

  toggleLayer(layerId: string, visible: boolean): void {
    this.store.dispatch(AppActions.toggleLayer({ layerId, visible }));
  }

  updateOpacity(layerId: string, opacity: number): void {
    this.store.dispatch(AppActions.updateLayerOpacity({ layerId, opacity }));
  }
}
