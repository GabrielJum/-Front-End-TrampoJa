import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

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

  protected readonly tabs: Tab[] = [
    { label: 'Buscar vagas', path: '/vagas' },
    { label: 'Chat', path: '/chat' },
    { label: 'Solicitações', path: '/solicitacoes', badge: 3 },
    { label: 'Avaliações', badge: 7 },
  ];

}
