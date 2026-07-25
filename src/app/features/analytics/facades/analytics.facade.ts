import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AnalyticsFilter } from '../models/analytics.model';
import * as AppActions from '../../../store/app.actions';
import * as AppSelectors from '../../../store/app.selectors';
import { AppRootState } from '../../../store/app.state';

@Injectable({ providedIn: 'root' })
export class AnalyticsFacade {
  private readonly store = inject<Store<AppRootState>>(Store);

  readonly filters$ = this.store.select(AppSelectors.selectAnalyticsFilters);

  updateFilters(filters: Partial<AnalyticsFilter>): void {
    this.store.dispatch(AppActions.updateAnalyticsFilters({ filters }));
  }
}
