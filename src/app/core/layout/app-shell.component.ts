import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CookieBannerComponent } from '../layout/cookie-banner.component';
import { SettingsFacade } from '../../features/settings/facades/settings.facade';

interface NavItem {
  path: string;
  icon: string;
  labelKey: string;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    TranslatePipe,
    CookieBannerComponent,
  ],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {
  private readonly settingsFacade = inject(SettingsFacade);

  readonly mobileNavOpened = signal(false);
  readonly theme = this.settingsFacade.currentTheme;
  readonly navItems: NavItem[] = [
    { path: '/map', icon: 'map', labelKey: 'NAV.MAP' },
    { path: '/dashboard', icon: 'dashboard', labelKey: 'NAV.DASHBOARD' },
    { path: '/analytics', icon: 'analytics', labelKey: 'NAV.ANALYTICS' },
    { path: '/layers', icon: 'layers', labelKey: 'NAV.LAYERS' },
    { path: '/settings', icon: 'settings', labelKey: 'NAV.SETTINGS' },
  ];

  constructor() {
    this.settingsFacade.initialize();
  }

  toggleTheme(): void {
    this.settingsFacade.toggleTheme();
  }

  setLanguage(language: 'it' | 'en'): void {
    this.settingsFacade.setLanguage(language);
  }

  closeMobileNav(): void {
    this.mobileNavOpened.set(false);
  }

  trackByPath(_: number, item: NavItem): string {
    return item.path;
  }
}
