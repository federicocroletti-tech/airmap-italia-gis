import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../../core/services/theme.service';
import * as AppActions from '../../../store/app.actions';
import * as AppSelectors from '../../../store/app.selectors';
import { AppRootState } from '../../../store/app.state';

@Injectable({ providedIn: 'root' })
export class SettingsFacade {
  private readonly store = inject<Store<AppRootState>>(Store);
  private readonly translateService = inject(TranslateService);
  private readonly themeService = inject(ThemeService);

  readonly language$ = this.store.select(AppSelectors.selectLanguage);
  readonly theme$ = this.store.select(AppSelectors.selectTheme);
  readonly currentTheme = this.themeService.currentTheme;

  initialize(): void {
    this.setLanguage((localStorage.getItem('airmap-language') as 'it' | 'en' | null) ?? 'it');
    this.setTheme(this.themeService.getCurrentTheme());
  }

  setLanguage(language: 'it' | 'en'): void {
    localStorage.setItem('airmap-language', language);
    this.translateService.use(language);
    this.store.dispatch(AppActions.setLanguage({ language }));
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.themeService.setTheme(theme);
    this.store.dispatch(AppActions.setTheme({ theme }));
  }

  toggleTheme(): void {
    const nextTheme = this.themeService.getCurrentTheme() === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }
}
