import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Header } from '../../components/header/header';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Footer } from '../../components/footer/footer';

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
  imports: [DecimalPipe, Header, RouterLink, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
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

}
