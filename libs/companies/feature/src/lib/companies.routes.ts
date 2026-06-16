import { Routes } from '@angular/router';

/**
 * Routes enfant de la feature « companies », montées sous le préfixe `/companies`
 * (cf. `app.routes.ts`, `loadChildren`). La feature possède ainsi son propre namespace
 * d'URL et reste autonome : prête à devenir une lib Nx (déplacer le dossier suffit).
 */
export const COMPANIES_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    loadComponent: () => import('./page-list-companies/page-list-companies'),
  },
  {
    path: 'add',
    loadComponent: () => import('./page-add-company/page-add-company'),
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./page-edit-company/page-edit-company'),
  },
];
