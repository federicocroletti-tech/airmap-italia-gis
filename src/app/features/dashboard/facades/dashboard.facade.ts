import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AppActions from '../../../store/app.actions';
import * as AppSelectors from '../../../store/app.selectors';
import { AppRootState } from '../../../store/app.state';

@Injectable({ providedIn: 'root' })
export class DashboardFacade {
  private readonly store = inject<Store<AppRootState>>(Store);

  readonly data$ = this.store.select(AppSelectors.selectDashboardData);
  readonly loading$ = this.store.select(AppSelectors.selectDashboardLoading);

  loadDashboard(): void {
    this.store.dispatch(AppActions.loadDashboard());
  }
}
