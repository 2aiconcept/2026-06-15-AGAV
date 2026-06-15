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
        path: 'list-companies',
        loadComponent: () => import('./feature-companies/pages/page-list-companies/page-list-companies'),
    },
    {
        path: 'add-company',
        loadComponent: () => import('./feature-companies/pages/page-add-company/page-add-company'),
    },
    {
        path: 'edit-company/:id',
        loadComponent: () => import('./feature-companies/pages/page-edit-company/page-edit-company')
    },
    {
        path: '**',
        loadComponent: () => import('./feature-not-found/pages/page-not-found/page-not-found')
    },
];


