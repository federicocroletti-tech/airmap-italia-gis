import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { SettingsFacade } from '../facades/settings.facade';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, MatButtonToggleModule, MatCardModule, MatIconModule, TranslatePipe],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent {
  private readonly settingsFacade = inject(SettingsFacade);

  readonly language = toSignal(this.settingsFacade.language$, { initialValue: 'it' as const });
  readonly theme = toSignal(this.settingsFacade.theme$, { initialValue: 'light' as const });

  setLanguage(language: 'it' | 'en'): void {
    this.settingsFacade.setLanguage(language);
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.settingsFacade.setTheme(theme);
  }
}
