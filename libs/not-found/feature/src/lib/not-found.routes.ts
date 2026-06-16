import { Route } from '@angular/router';

/**
 * Route « catch-all » (404). Reste montée à la racine de `app.routes.ts` (path `**`, en
 * dernier), désormais extraite dans la lib `@mini-crm/not-found/feature`.
 */
export const NOT_FOUND_ROUTE: Route = {
  path: '**',
  loadComponent: () => import('./page-not-found/page-not-found'),
};
