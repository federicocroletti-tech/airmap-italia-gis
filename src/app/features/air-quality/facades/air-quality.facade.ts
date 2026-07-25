import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AirQualityArea } from '../models/air-quality.model';
import { AirQualityDataService } from '../services/air-quality-data.service';
import * as AppActions from '../../../store/app.actions';
import * as AppSelectors from '../../../store/app.selectors';
import { AppRootState } from '../../../store/app.state';

@Injectable({ providedIn: 'root' })
export class AirQualityFacade {
  private readonly store = inject<Store<AppRootState>>(Store);
  private readonly airQualityDataService = inject(AirQualityDataService);

  readonly areas$ = this.store.select(AppSelectors.selectAirQualityAreas);
  readonly selectedArea$ = this.store.select(AppSelectors.selectSelectedArea);
  readonly selectedAreaHistory$ = this.store.select(AppSelectors.selectSelectedAreaHistory);
  readonly loading$ = this.store.select(AppSelectors.selectAirQualityLoading);
  readonly error$ = this.store.select(AppSelectors.selectAirQualityError);

  loadAreas(): void {
    this.store.dispatch(AppActions.loadAirQualityAreas());
  }

  selectArea(areaId: string | null): void {
    this.store.dispatch(AppActions.selectAirQualityArea({ areaId }));
  }

  exportArea(area: AirQualityArea): void {
    this.airQualityDataService.exportAreaAsJson(area);
  }
}
