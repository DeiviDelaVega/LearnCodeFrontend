import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('google_token');

  // Endpoints públicos donde NO debe enviarse token
  const publicEndpoints = [
    "/api/courses"
  ];

  const isPublic = publicEndpoints.some(endpoint =>
    req.url.includes(endpoint)
  );

  // Solo agregar token si NO es público
 if (token && req.url.includes("localhost:8080")) { 
  req = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
}
  else {
    console.log("🚫 Token NO enviado a:", req.url);
  }

  return next(req);
};
