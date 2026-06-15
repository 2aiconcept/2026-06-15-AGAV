import { Routes } from '@angular/router';
import { PageConnect } from './feature-connect/pages/page-connect/page-connect';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'connect',
        pathMatch: 'full'
    },
    {
        path: 'connect',
        component: PageConnect,
    },
    {
        path: 'companies',
        loadChildren: () =>
            import('./feature-companies/companies.routes').then((m) => m.COMPANIES_ROUTES),
    },
    {
        path: '**',
        loadComponent: () => import('./feature-not-found/pages/page-not-found/page-not-found')
    },
];


