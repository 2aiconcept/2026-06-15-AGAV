import { Routes } from '@angular/router';

/**
 * Routes enfant de la feature « contacts », montées sous le préfixe `/contacts`
 * (cf. `app.routes.ts`, `loadChildren`). Même pattern que `companies` : la feature possède
 * son propre namespace d'URL et reste autonome, prête à devenir une lib Nx.
 */
export const CONTACTS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    loadComponent: () => import('./pages/page-list-contacts/page-list-contacts'),
  },
  {
    path: 'add',
    loadComponent: () => import('./pages/page-add-contact/page-add-contact'),
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./pages/page-edit-contact/page-edit-contact'),
  },
];
