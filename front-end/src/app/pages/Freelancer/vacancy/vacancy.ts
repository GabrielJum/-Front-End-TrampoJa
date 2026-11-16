import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCalendarDays,
  faCheck,
  faClock,
  faDollarSign,
  faFilter,
  faLocationDot,
  faStar,
  faTableCellsLarge,
} from '@fortawesome/free-solid-svg-icons';
import { Header } from '../../../components/header/header';
import { NavigationTabs } from '../../../components/navigation-tabs/navigation-tabs';
import { Footer } from '../../../components/footer/footer';
import { VacancyService } from '../../../service/vacancy/vacancy';
import { VacancyType } from '../../../model/vacancy';
import { TooltipService } from '../../../service/tooltip/tooltip';

@Component({
  selector: 'app-vacancy',
  imports: [FormsModule, RouterLink, FontAwesomeModule, Header, NavigationTabs, Footer],
  templateUrl: './vacancy.html',
  styleUrl: './vacancy.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Vacancy implements OnInit {
  private readonly vacancyService = inject(VacancyService);
  private readonly tooltip = inject(TooltipService);

  protected readonly vagas = signal<VacancyType[]>([]);

  protected readonly icons = {
    filter: faFilter,
    location: faLocationDot,
    category: faTableCellsLarge,
    calendar: faCalendarDays,
    price: faDollarSign,
    clock: faClock,
    star: faStar,
    check: faCheck,
  };

  // Estático por enquanto (ainda não existe avaliação na API)
  protected readonly stars = [1, 2, 3, 4, 5];
  protected readonly rating = 5;

  // Candidaturas (estático por enquanto, só no front)
  protected readonly appliedIds = signal(new Set<number>());

  // Filtros
  protected readonly filtersOpen = signal(false);
  protected readonly location = signal('any');
  protected readonly category = signal('any');
  protected readonly price = signal('any');
  protected readonly date = signal('any');

  // Filtros que realmente estão aplicados na lista (só mudam ao clicar em "Aplicar filtros")
  private readonly applied = signal({ location: 'any', category: 'any', price: 'any', date: 'any' });

  protected readonly locations = computed(() =>
    [...new Set(this.vagas().map((v) => `${v.cidade} - ${v.estado}`))].sort(),
  );

  protected readonly categories = computed(() =>
    [...new Set(this.vagas().map((v) => v.categoria))].sort(),
  );

  protected readonly activeFilterCount = computed(
    () => Object.values(this.applied()).filter((f) => f !== 'any').length,
  );

  protected readonly vagasFiltradas = computed(() => {
    const { location, category, price, date } = this.applied();

    return this.vagas().filter((v) => {
      if (location !== 'any' && `${v.cidade} - ${v.estado}` !== location) return false;
      if (category !== 'any' && v.categoria !== category) return false;
      if (price === 'upTo100' && v.valor > 100) return false;
      if (price === '100to150' && (v.valor < 100 || v.valor > 150)) return false;
      if (price === 'over150' && v.valor <= 150) return false;
      if (date !== 'any' && !this.dentroDoPeriodo(v.data, date)) return false;
      return true;
    });
  });

  ngOnInit(): void {
    this.carregarTodasVagas();
  }

  protected toggleFilters(): void {
    this.filtersOpen.update((open) => !open);
  }

  protected applyFilters(): void {
    this.applied.set({
      location: this.location(),
      category: this.category(),
      price: this.price(),
      date: this.date(),
    });
    this.filtersOpen.set(false);
  }

  protected clearFilters(): void {
    this.location.set('any');
    this.category.set('any');
    this.price.set('any');
    this.date.set('any');
    this.applyFilters();
  }

  private dentroDoPeriodo(data: string, periodo: string): boolean {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dataVaga = new Date(`${data.slice(0, 10)}T00:00:00`);
    const diffDias = Math.round((dataVaga.getTime() - hoje.getTime()) / 86_400_000);

    if (periodo === 'today') return diffDias === 0;
    if (periodo === 'week') return diffDias >= 0 && diffDias <= 7;
    if (periodo === 'month') return diffDias >= 0 && diffDias <= 30;
    return true;
  }

  protected apply(id: number): void {
    this.appliedIds.update((ids) => new Set(ids).add(id));
    this.tooltip.success('Candidatura enviada!');
  }

  protected initials(nome = ''): string {
    return nome
      .split(' ')
      .slice(0, 2)
      .map((p) => p[0])
      .join('')
      .toUpperCase();
  }

  private carregarTodasVagas(): void {
    this.vacancyService.listarTodasAsVagas().subscribe({
      next: (vagas) => this.vagas.set(vagas),
      error: () => this.tooltip.error('Não foi possível carregar as vagas.'),
    });
  }
}
