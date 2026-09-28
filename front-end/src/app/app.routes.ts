import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/auth/auth').then(m => m.Auth)
    },
    {
        path: 'home',
        loadComponent: () =>
            import('./pages/home/home').then(m => m.Home)
    }
];
