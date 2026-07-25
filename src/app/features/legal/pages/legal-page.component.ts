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
          <p>{{ 'LEGAL.PLACEHOLDER' | translate }}</p>
          <p>
            Questa pagina contiene una struttura base da completare con consulenza legale prima
            della pubblicazione.
          </p>
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
}
