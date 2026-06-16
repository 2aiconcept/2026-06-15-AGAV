import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from './auth';

/**
 * Protège les routes nécessitant une authentification.
 * Laisse passer si l'utilisateur est connecté ; sinon redirige vers `/connect`
 * en mémorisant l'URL demandée (`returnUrl`) pour y revenir après connexion.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/connect'], {
    queryParams: { returnUrl: state.url },
  });
};
