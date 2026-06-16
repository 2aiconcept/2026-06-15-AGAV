import { Routes } from '@angular/router';
import { PageConnect } from '@mini-crm/connect/feature';
import { NOT_FOUND_ROUTE } from '@mini-crm/not-found/feature';
import { authGuard } from '@mini-crm/shared/data-access';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'connect',
    pathMatch: 'full',
  },
  {
    path: 'connect',
    component: PageConnect,
  },
  {
    path: 'companies',
    canActivate: [authGuard],
    loadChildren: () => import('@mini-crm/companies/feature').then((m) => m.COMPANIES_ROUTES),
  },
  {
    path: 'contacts',
    canActivate: [authGuard],
    loadChildren: () => import('@mini-crm/contacts/feature').then((m) => m.CONTACTS_ROUTES),
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadChildren: () => import('@mini-crm/orders/feature').then((m) => m.ORDERS_ROUTES),
  },
  NOT_FOUND_ROUTE,
];
