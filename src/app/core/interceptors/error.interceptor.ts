import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (request, next) =>
  next(request).pipe(
    catchError((error: unknown) => {
      const message =
        error instanceof HttpErrorResponse
          ? getHttpErrorMessage(error)
          : 'Errore applicativo inatteso.';
      return throwError(() => new Error(message));
    }),
  );

function getHttpErrorMessage(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'Servizio non raggiungibile. Verifica la connessione o riprova piu tardi.';
  }

  if (error.status >= 500) {
    return 'Il servizio dati ambientali non e al momento disponibile.';
  }

  if (error.status === 404) {
    return 'Risorsa geografica non trovata.';
  }

  return 'Richiesta non completata. Riprova tra qualche minuto.';
}
