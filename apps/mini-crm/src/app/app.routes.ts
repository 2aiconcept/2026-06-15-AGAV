import { Routes } from '@angular/router';
import { PageConnect } from './feature-connect/pages/page-connect/page-connect';
import { NOT_FOUND_ROUTE } from './feature-not-found/not-found.routes';

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
    loadChildren: () => import('@mini-crm/companies/feature').then((m) => m.COMPANIES_ROUTES),
  },
  {
    path: 'contacts',
    loadChildren: () => import('./feature-contacts/contacts.routes').then((m) => m.CONTACTS_ROUTES),
  },
  {
    path: 'orders',
    loadChildren: () => import('./feature-orders/orders.routes').then((m) => m.ORDERS_ROUTES),
  },
  NOT_FOUND_ROUTE,
];
