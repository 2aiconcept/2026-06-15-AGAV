import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from './auth';

/**
 * Ajoute l'en-tête `Authorization: Bearer <token>` aux requêtes sortantes lorsqu'un
 * utilisateur est connecté. Les requêtes anonymes (login / register, émises avant
 * l'obtention du token) passent inchangées.
 *
 * Interceptor fonctionnel (`HttpInterceptorFn`) : il s'exécute dans le contexte d'injection,
 * donc `inject()` y est disponible. À enregistrer via
 * `provideHttpClient(withInterceptors([authInterceptor]))`.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(Auth).token();

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(authReq);
};
