import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { CookieConsentService } from '../services/cookie-consent.service';
import { CookiePreferencesDialogComponent } from './cookie-preferences-dialog.component';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, TranslatePipe],
  template: `
    @if (visible()) {
      <aside class="cookie-banner" aria-labelledby="cookie-title">
        <div>
          <h2 id="cookie-title">{{ 'COOKIE.TITLE' | translate }}</h2>
          <p>{{ 'COOKIE.TEXT' | translate }}</p>
        </div>
        <div class="cookie-actions">
          <button mat-button type="button" (click)="rejectOptional()">
            {{ 'COOKIE.REJECT_OPTIONAL' | translate }}
          </button>
          <button mat-stroked-button type="button" (click)="customize()">
            {{ 'COOKIE.CUSTOMIZE' | translate }}
          </button>
          <button mat-flat-button color="primary" type="button" (click)="acceptAll()">
            {{ 'COOKIE.ACCEPT_ALL' | translate }}
          </button>
        </div>
      </aside>
    }
  `,
  styles: [
    `
      .cookie-banner {
        align-items: center;
        background: var(--airmap-panel-bg);
        border: 1px solid var(--airmap-border);
        border-radius: 8px;
        bottom: 1rem;
        box-shadow: var(--airmap-panel-shadow);
        color: var(--airmap-text);
        display: flex;
        gap: 1rem;
        left: 50%;
        max-width: min(58rem, calc(100vw - 2rem));
        padding: 1rem;
        position: fixed;
        transform: translateX(-50%);
        z-index: 900;
      }
      h2 {
        font-size: 1rem;
        margin: 0 0 0.3rem;
      }
      p {
        color: var(--airmap-muted);
        margin: 0;
      }
      .cookie-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        justify-content: flex-end;
      }
      @media (max-width: 760px) {
        .cookie-banner {
          align-items: stretch;
          flex-direction: column;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookieBannerComponent {
  private readonly cookieConsentService = inject(CookieConsentService);
  private readonly dialog = inject(MatDialog);

  readonly visible = computed(() => !this.cookieConsentService.hasConsent());

  acceptAll(): void {
    this.cookieConsentService.acceptAll();
  }

  rejectOptional(): void {
    this.cookieConsentService.rejectOptional();
  }

  customize(): void {
    this.dialog.open(CookiePreferencesDialogComponent, {
      width: '34rem',
      maxWidth: 'calc(100vw - 2rem)',
    });
  }
}
