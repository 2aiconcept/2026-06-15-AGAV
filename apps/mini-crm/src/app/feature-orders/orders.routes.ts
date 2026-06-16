import { Routes } from '@angular/router';

/**
 * Routes enfant de la feature « orders », montées sous le préfixe `/orders`
 * (cf. `app.routes.ts`, `loadChildren`). Même pattern que `companies` : la feature possède
 * son propre namespace d'URL et reste autonome, prête à devenir une lib Nx.
 */
export const ORDERS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    loadComponent: () => import('./pages/page-list-orders/page-list-orders'),
  },
  {
    path: 'add',
    loadComponent: () => import('./pages/page-add-order/page-add-order'),
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./pages/page-edit-order/page-edit-order'),
  },
];
