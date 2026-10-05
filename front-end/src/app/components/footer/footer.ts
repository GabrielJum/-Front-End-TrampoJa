import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface NavLink {
  label: string;
  path: string;
}

@Component({
  imports: [RouterLink],
  selector: 'app-footer',
  styleUrl: './footer.css',
  templateUrl: './footer.html',
})
export class Footer {
  protected readonly year = new Date().getFullYear();

  protected readonly footerNav: NavLink[] = [
    { label: 'Início', path: '/home' },
    { label: 'Vagas', path: '/vagas' },
    { label: 'Para empresas', path: '/empresas' },
    { label: 'Como funciona', path: '/como-funciona' },
  ];

  protected readonly footerHelp: NavLink[] = [
    { label: 'Central de ajuda', path: '/ajuda' },
    { label: 'Dúvidas frequentes', path: '/faq' },
    { label: 'Termos de uso', path: '/termos' },
    { label: 'Política de privacidade', path: '/privacidade' },
  ];

}
