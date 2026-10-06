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
        path: 'vagas/:id',
        loadComponent: () =>
            import('./pages/vacancy/vacancy-detail/vacancy-detail').then(m => m.VacancyDetail)
    },
    {
        path: 'chat', 
        loadComponent: () =>
            import('./pages/chat/chat').then(m => m.Chat)
    },
    {
        path: 'solicitacoes',
        loadComponent: () =>
            import('./pages/solicitation/solicitation').then(m => m.Solicitation)
    },
    {
        path: 'perfil',
        loadComponent: () =>
            import('./pages/profile/profile').then(m => m.Profile)
    },

];
