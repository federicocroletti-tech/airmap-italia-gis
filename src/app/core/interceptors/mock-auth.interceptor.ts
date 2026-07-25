import { HttpInterceptorFn } from '@angular/common/http';

export const mockAuthInterceptor: HttpInterceptorFn = (request, next) => {
  const enrichedRequest = request.clone({
    setHeaders: {
      'X-AirMap-Client': 'airmap-italia-demo',
    },
  });

  return next(enrichedRequest);
};
