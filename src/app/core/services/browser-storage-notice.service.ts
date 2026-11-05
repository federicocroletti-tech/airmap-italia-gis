import { Injectable, signal } from '@angular/core';

const STORAGE_NOTICE_KEY = 'airmap-storage-notice-dismissed';

@Injectable({ providedIn: 'root' })
export class BrowserStorageNoticeService {
  private readonly dismissedSignal = signal(this.readDismissed());

  readonly dismissed = this.dismissedSignal.asReadonly();

  dismiss(): void {
    localStorage.setItem(STORAGE_NOTICE_KEY, 'true');
    this.dismissedSignal.set(true);
  }

  private readDismissed(): boolean {
    return localStorage.getItem(STORAGE_NOTICE_KEY) === 'true';
  }
}
