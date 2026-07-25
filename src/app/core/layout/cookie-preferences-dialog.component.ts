import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { CookieConsentPreferences, CookieConsentService } from '../services/cookie-consent.service';

@Component({
  selector: 'app-cookie-preferences-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCheckboxModule, MatDialogModule, TranslatePipe],
  template: `
    <h2 mat-dialog-title>{{ 'COOKIE.TITLE' | translate }}</h2>
    <mat-dialog-content class="preferences">
      <mat-checkbox checked disabled>{{ 'COOKIE.NECESSARY' | translate }}</mat-checkbox>
      <mat-checkbox [checked]="preferences()" (change)="preferences.set($event.checked)">{{
        'COOKIE.PREFERENCES' | translate
      }}</mat-checkbox>
      <mat-checkbox [checked]="statistics()" (change)="statistics.set($event.checked)">{{
        'COOKIE.STATISTICS' | translate
      }}</mat-checkbox>
      <mat-checkbox [checked]="marketing()" (change)="marketing.set($event.checked)">{{
        'COOKIE.MARKETING' | translate
      }}</mat-checkbox>
      <p>{{ 'LEGAL.PLACEHOLDER' | translate }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close type="button">{{ 'COMMON.CLOSE' | translate }}</button>
      <button mat-flat-button color="primary" type="button" (click)="save()">
        {{ 'COOKIE.SAVE' | translate }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .preferences {
        display: grid;
        gap: 0.75rem;
      }
      p {
        color: var(--airmap-muted);
        margin: 0.5rem 0 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookiePreferencesDialogComponent {
  private readonly cookieConsentService = inject(CookieConsentService);
  private readonly dialogRef = inject<MatDialogRef<CookiePreferencesDialogComponent>>(MatDialogRef);
  private readonly savedPreferences = this.cookieConsentService.preferences();

  readonly preferences = signal(this.savedPreferences?.preferences ?? false);
  readonly statistics = signal(this.savedPreferences?.statistics ?? false);
  readonly marketing = signal(this.savedPreferences?.marketing ?? false);

  save(): void {
    const preferences: CookieConsentPreferences = {
      necessary: true,
      preferences: this.preferences(),
      statistics: this.statistics(),
      marketing: this.marketing(),
      updatedAt: new Date().toISOString(),
    };

    this.cookieConsentService.save(preferences);
    this.dialogRef.close();
  }
}
