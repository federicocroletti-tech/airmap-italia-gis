import { Injectable, signal } from '@angular/core';

export type CookieCategory = 'necessary' | 'preferences' | 'statistics' | 'marketing';

export interface CookieConsentPreferences {
  necessary: true;
  preferences: boolean;
  statistics: boolean;
  marketing: boolean;
  updatedAt: string;
}

const COOKIE_STORAGE_KEY = 'airmap-cookie-consent';

const DEFAULT_CONSENT: CookieConsentPreferences = {
  necessary: true,
  preferences: false,
  statistics: false,
  marketing: false,
  updatedAt: '',
};

@Injectable({ providedIn: 'root' })
export class CookieConsentService {
  private readonly preferencesSignal = signal<CookieConsentPreferences | null>(
    this.readPreferences(),
  );

  readonly preferences = this.preferencesSignal.asReadonly();
  readonly hasConsent = signal(this.preferencesSignal() !== null);

  acceptAll(): void {
    this.save({
      necessary: true,
      preferences: true,
      statistics: true,
      marketing: true,
      updatedAt: new Date().toISOString(),
    });
  }

  rejectOptional(): void {
    this.save({ ...DEFAULT_CONSENT, updatedAt: new Date().toISOString() });
  }

  save(preferences: CookieConsentPreferences): void {
    localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(preferences));
    this.preferencesSignal.set(preferences);
    this.hasConsent.set(true);
  }

  canUse(category: Exclude<CookieCategory, 'necessary'>): boolean {
    return this.preferencesSignal()?.[category] ?? false;
  }

  private readPreferences(): CookieConsentPreferences | null {
    const rawValue = localStorage.getItem(COOKIE_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    try {
      return JSON.parse(rawValue) as CookieConsentPreferences;
    } catch {
      return null;
    }
  }
}
