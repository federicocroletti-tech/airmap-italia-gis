import { Routes } from '@angular/router';
import { appReadyGuard } from './core/guards/app-ready.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/app-shell.component').then((component) => component.AppShellComponent),
    canMatch: [appReadyGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'map' },
      {
        path: 'map',
        loadComponent: () =>
          import('./features/map/containers/map-page.component').then(
            (component) => component.MapPageComponent,
          ),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/containers/dashboard-page.component').then(
            (component) => component.DashboardPageComponent,
          ),
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./features/analytics/containers/analytics-page.component').then(
            (component) => component.AnalyticsPageComponent,
          ),
      },
      {
        path: 'layers',
        loadComponent: () =>
          import('./features/layers/containers/layers-page.component').then(
            (component) => component.LayersPageComponent,
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/containers/settings-page.component').then(
            (component) => component.SettingsPageComponent,
          ),
      },
      {
        path: 'privacy-policy',
        data: { page: 'privacy' },
        loadComponent: () =>
          import('./features/legal/pages/legal-page.component').then(
            (component) => component.LegalPageComponent,
          ),
      },
      {
        path: 'cookie-policy',
        data: { page: 'cookie' },
        loadComponent: () =>
          import('./features/legal/pages/legal-page.component').then(
            (component) => component.LegalPageComponent,
          ),
      },
      {
        path: 'termini-servizio',
        data: { page: 'terms' },
        loadComponent: () =>
          import('./features/legal/pages/legal-page.component').then(
            (component) => component.LegalPageComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'map' },
];
