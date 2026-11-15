import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../service/auth/auth';

interface Tab {
  label: string;
  path?: string;
  badge?: number;
}

const FREELANCER_TABS: Tab[] = [
  { label: 'Vagas', path: '/vagas' },
  { label: 'Chat', path: '/chat', badge: 2 },
  { label: 'Solicitações', path: '/freelancer/solicitacoes' },
  { label: 'Avaliações', path: '/avaliacoes', badge: 7 },
];

const ENTERPRISE_TABS: Tab[] = [
  { label: 'Gerenciar vagas', path: '/gerenciar-vagas' },
  { label: 'Chat', path: '/chat', badge: 2 },
  { label: 'Solicitações', path: '/empresa/solicitacoes' },
  { label: 'Avaliações', path: '/avaliacoes', badge: 7 },
];

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-navigation-tabs',
  styleUrl: './navigation-tabs.css',
  templateUrl: './navigation-tabs.html',
})
export class NavigationTabs {
  private readonly auth = inject(AuthService);

  private readonly isLoggedIn = this.auth.isLoggedIn();

  protected readonly user = this.auth.user;

  protected readonly tabs = computed<Tab[]>(() =>
    this.auth.role() === 'Freelancer' ? FREELANCER_TABS : ENTERPRISE_TABS,
  );
}
