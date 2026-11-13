import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'freelancers/login',
        loadComponent: () =>
            import('./pages/Freelancer/auth-freelancer/login/login').then(m => m.Login)
    },
    {
        path: 'freelancers/cadastro',
        loadComponent: () =>
            import('./pages/Freelancer/auth-freelancer/register/register').then(m => m.Register)
    },
    {
        path: 'auth',
        redirectTo: 'freelancers/login',
        pathMatch: 'full'
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () =>
            import('./pages/home/home').then(m => m.Home)
    },
    {
        path: 'empresas',
        loadComponent: () =>
            import('./pages/home-enterprise/enterprise').then(m => m.Enterprise)
    },
    {
        path: 'empresas/login',
        loadComponent: () =>
            import('./pages/Enterprise/authEnterprise/login/login').then(m => m.Login)
    },
    {
        path: 'empresas/cadastro',
        loadComponent: () =>
            import('./pages/Enterprise/authEnterprise/register/register').then(m => m.Register)
    },
    {
        path: 'gerenciar-vagas',
        loadComponent: () =>
            import('./pages/Enterprise/vacancy-manage/vacancy-manage').then(m => m.VacancyManage)
    },
    {
        path: 'vagas',
        loadComponent: () =>
            import('./pages/Freelancer/vacancy/vacancy').then(m => m.Vacancy)
    },
    {
        path: 'vagas/:id',
        loadComponent: () =>
            import('./pages/Freelancer/vacancy/vacancy-detail/vacancy-detail').then(m => m.VacancyDetail)
    },
    {
        path: 'chat',
        loadComponent: () =>
            import('./pages/chat/chat').then(m => m.Chat)
    },
    {
        path: 'freelancer/solicitacoes',
        loadComponent: () =>
            import('./pages/Freelancer/solicitation-freelancer/solicitation-freelancer').then(m => m.SolicitationFreelancer)
    },
    {
        path: 'empresa/solicitacoes',
        loadComponent: () =>
            import('./pages/Enterprise/solicitation-enterprise/solicitation-enterprise').then(m => m.SolicitationEnterprise)
    },
    {
        path: 'perfil',
        loadComponent: () =>
            import('./pages/profile/profile').then(m => m.Profile)
    },
    {
        path: 'contato',
        loadComponent: () =>
            import('./pages/contact/contact').then(m => m.Contact)
    },
    {
        path: 'avaliacoes',
        loadComponent: () =>
            import('./pages/Freelancer/review/review').then(m => m.Review)
    },

];
