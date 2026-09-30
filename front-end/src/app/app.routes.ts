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
    },
    {
        path: 'vagas',
        loadComponent: () =>
            import('./pages/vacancy/vacancy').then(m => m.Vacancy)
    },
    {
        path: 'chat', 
        loadComponent: () =>
            import('./pages/chat/chat').then(m => m.Chat)
    },

];
