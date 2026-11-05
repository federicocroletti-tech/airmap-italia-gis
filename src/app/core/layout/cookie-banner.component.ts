import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { BrowserStorageNoticeService } from '../services/browser-storage-notice.service';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterLink, TranslatePipe],
  template: `
    @if (visible()) {
      <aside class="storage-notice" aria-labelledby="storage-notice-title">
        <div>
          <h2 id="storage-notice-title">{{ 'COOKIE.TITLE' | translate }}</h2>
          <p>{{ 'COOKIE.TEXT' | translate }}</p>
          <a mat-button routerLink="/privacy-policy">{{ 'LEGAL.PRIVACY' | translate }}</a>
        </div>
        <div class="notice-actions">
          <button mat-flat-button color="primary" type="button" (click)="dismiss()">
            {{ 'COOKIE.ACKNOWLEDGE' | translate }}
          </button>
        </div>
      </aside>
    }
  `,
  styles: [
    `
      .storage-notice {
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
        line-height: 1.5;
        margin: 0;
      }
      a {
        margin-left: -0.5rem;
      }
      .notice-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        justify-content: flex-end;
      }
      @media (max-width: 760px) {
        .storage-notice {
          align-items: stretch;
          flex-direction: column;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookieBannerComponent {
  private readonly storageNotice = inject(BrowserStorageNoticeService);

  readonly visible = computed(() => !this.storageNotice.dismissed());

  dismiss(): void {
    this.storageNotice.dismiss();
  }
}
