import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

type CategoryIcon = 'shield' | 'party' | 'moto' | 'helmet' | 'truck' | 'dish';

interface Category {
  name: string;
  slug: string;
  jobs: number;
  icon: CategoryIcon;
}

interface NavLink {
  label: string;
  path: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterLinkActive, DecimalPipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly year = new Date().getFullYear();
  protected readonly menuOpen = signal(false);

  protected readonly navLinks: NavLink[] = [
    { label: 'Início', path: '/home' },
    { label: 'Vagas', path: '/vagas' },
    { label: 'Para empresas', path: '/empresas' },
    { label: 'Contato', path: '/contato' },
  ];

  protected readonly categories = signal<Category[]>([
    { name: 'Segurança', slug: 'seguranca', jobs: 857, icon: 'shield' },
    { name: 'Eventos', slug: 'eventos', jobs: 312, icon: 'party' },
    { name: 'Motoboy', slug: 'motoboy', jobs: 675, icon: 'moto' },
    { name: 'Obras', slug: 'obras', jobs: 546, icon: 'helmet' },
    { name: 'Food truck', slug: 'food-truck', jobs: 123, icon: 'truck' },
    { name: 'Restaurante', slug: 'restaurante', jobs: 473, icon: 'dish' },
  ]);

  protected readonly totalJobs = computed(() =>
    this.categories().reduce((sum, c) => sum + c.jobs, 0),
  );

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

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
