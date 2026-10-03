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
        path: 'avaliacoes',
        loadComponent: () =>
            import('./pages/avaliacoes/avaliacoes').then(m => m.Avaliacoes)
    },
    {
        path: 'candidato',
        loadComponent: () =>
            import('./pages/candidato/candidato').then(m => m.Candidato)
    },
    {
        path: 'chat',
        loadComponent: () =>
            import('./pages/chat/chat').then(m => m.Chat)
    },
    {
        path: 'dados',
        loadComponent: () =>
            import('./pages/dados/dados').then(m => m.Dados)
    },
    {
        path: 'solicitacoes',
        loadComponent: () =>
            import('./pages/solicitacoes/solicitacoes').then(m => m.Solicitacoes)
    },
    {
        path: 'vagas',
        loadComponent: () =>
            import('./pages/vagas/vagas').then(m => m.Vagas)
    }
];
