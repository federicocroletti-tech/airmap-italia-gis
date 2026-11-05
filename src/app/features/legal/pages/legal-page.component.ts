import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { map } from 'rxjs';

type LegalPage = 'privacy' | 'cookie' | 'terms';

@Component({
  selector: 'app-legal-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, TranslatePipe],
  template: `
    <section class="legal-page" aria-labelledby="legal-title">
      <mat-card>
        <mat-card-header
          ><mat-card-title id="legal-title">{{
            titleKey() | translate
          }}</mat-card-title></mat-card-header
        >
        <mat-card-content>
          <p class="demo-notice">{{ 'LEGAL.DEMO_NOTICE' | translate }}</p>
          @for (sectionKey of sectionKeys(); track sectionKey) {
            <p>{{ sectionKey | translate }}</p>
          }
          @if (page() === 'privacy') {
            <p>
              <a href="mailto:federico.croletti@gmail.com">{{
                'LEGAL.CONTACT' | translate
              }}</a>
            </p>
            <p>
              <a
                href="https://osmfoundation.org/wiki/Privacy_Policy"
                target="_blank"
                rel="noopener noreferrer"
                >{{ 'LEGAL.OSM_PRIVACY' | translate }}</a
              >
            </p>
          }
        </mat-card-content>
      </mat-card>
    </section>
  `,
  styles: [
    `
      .legal-page {
        max-width: 58rem;
      }
      mat-card {
        border-radius: 8px;
      }
      p {
        color: var(--airmap-muted);
        line-height: 1.7;
      }
      .demo-notice {
        background: var(--airmap-surface);
        border-left: 3px solid var(--airmap-primary);
        color: var(--airmap-text);
        padding: 0.75rem 1rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly page = toSignal(
    this.route.data.pipe(map((data) => (data['page'] ?? 'privacy') as LegalPage)),
    { initialValue: 'privacy' as LegalPage },
  );

  readonly titleKey = computed(() => {
    const keys: Record<LegalPage, string> = {
      privacy: 'LEGAL.PRIVACY',
      cookie: 'LEGAL.COOKIE',
      terms: 'LEGAL.TERMS',
    };

    return keys[this.page()];
  });

  readonly sectionKeys = computed(() => {
    const sections: Record<LegalPage, string[]> = {
      privacy: [
        'LEGAL.PRIVACY_DATA',
        'LEGAL.PRIVACY_STORAGE',
        'LEGAL.PRIVACY_EXTERNAL',
        'LEGAL.PRIVACY_CONTACT',
      ],
      cookie: ['LEGAL.COOKIE_STORAGE', 'LEGAL.COOKIE_TRACKING', 'LEGAL.COOKIE_CONTROL'],
      terms: ['LEGAL.TERMS_DEMO', 'LEGAL.TERMS_DATA', 'LEGAL.TERMS_THIRD_PARTY'],
    };

    return sections[this.page()];
  });
}
