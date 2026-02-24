import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('google_token');

  const publicEndpoints = ['/api/courses', '/api/stripe/webhook'];

  const isPublic = publicEndpoints.some((endpoint) => req.url.includes(endpoint));

  if (token && !isPublic) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req);
};