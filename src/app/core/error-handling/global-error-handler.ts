import { ErrorHandler, Injectable, signal } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly lastErrorSignal = signal<string | null>(null);

  readonly lastError = this.lastErrorSignal.asReadonly();

  handleError(error: unknown): void {
    const message = error instanceof Error ? error.message : 'Unexpected application error';
    this.lastErrorSignal.set(message);
  }
}
