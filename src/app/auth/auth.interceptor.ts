import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem("google_token");

   if (req.url.includes("/api/courses")) {
    return next(req);
  }

  if (token && req.url.includes("/api/admin")) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
