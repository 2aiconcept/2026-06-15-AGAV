import { Route } from '@angular/router';

/**
 * Route « catch-all » (404). Reste montée à la racine de `app.routes.ts` (path `**`, en
 * dernier), mais isolée ici pour que la feature soit déplaçable telle quelle vers une lib Nx.
 */
export const NOT_FOUND_ROUTE: Route = {
  path: '**',
  loadComponent: () => import('./pages/page-not-found/page-not-found'),
};
