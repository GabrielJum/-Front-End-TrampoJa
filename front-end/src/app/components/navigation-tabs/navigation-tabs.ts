import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { user } from '../../types/user';

interface Tab {
  label: string;
  path?: string;
  badge?: number;
}

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-navigation-tabs',
  styleUrl: './navigation-tabs.css',
  templateUrl: './navigation-tabs.html',
})

export class NavigationTabs {
  protected readonly user = user;

  protected readonly tabs: Tab[] = this.returnTabs();

  protected returnTabs(): Tab[] {
    if (this.user.role === 'Freelancer') {
      return [
        { label: 'Vagas', path: '/vagas' },
        { label: 'Chat', path: '/chat', badge: 2 },
        { label: 'Solicitações', path: '/solicitacoes' },
        { label: 'Avaliações', path: '/avaliacoes', badge: 7 },
      ];
    }

    return [
      { label: 'Gerenciar vagas', path: '/gerenciar-vagas' },
      { label: 'Chat', path: '/chat', badge: 2 },
      { label: 'Solicitações', path: '/solicitacoes' },
      { label: 'Avaliações', path: '/avaliacoes', badge: 7 },

    ];
  }

}



