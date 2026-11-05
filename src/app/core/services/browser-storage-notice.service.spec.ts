import { BrowserStorageNoticeService } from './browser-storage-notice.service';

describe('BrowserStorageNoticeService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts visible when the notice has not been dismissed', () => {
    const service = new BrowserStorageNoticeService();

    expect(service.dismissed()).toBe(false);
  });

  it('persists dismissal in browser storage', () => {
    const service = new BrowserStorageNoticeService();

    service.dismiss();

    expect(service.dismissed()).toBe(true);
    expect(localStorage.getItem('airmap-storage-notice-dismissed')).toBe('true');
    expect(new BrowserStorageNoticeService().dismissed()).toBe(true);
  });
});
