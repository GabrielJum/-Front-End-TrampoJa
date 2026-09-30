import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Header } from '../../components/header/header';
import { NavigationTabs } from '../../components/navigation-tabs/navigation-tabs';

type TabId = 'search' | 'chat' | 'requests' | 'reviews' | 'profile';
type DateFilter = 'any' | 'today' | 'week' | 'month';
type PriceFilter = 'any' | 'upTo100' | '100to150' | 'over150';

interface Tab {
  id: TabId;
  label: string;
  badge?: number;
}

interface Job {
  id: number;
  role: string;
  category: string;
  company: string;
  location: string;
  date: string; // ISO yyyy-mm-dd
  start: string;
  end: string;
  price: number;
  rating: number;
  logoUrl?: string;
  description: string;
}

interface Filters {
  location: string;
  category: string;
  date: DateFilter;
  price: PriceFilter;
  minRating: number;
}

const PAGE_SIZE = 4;

const EMPTY_FILTERS: Filters = {
  location: 'any',
  category: 'any',
  date: 'any',
  price: 'any',
  minRating: 0,
};

function daysFromToday(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

@Component({
  selector: 'app-vacancy',
  imports: [FormsModule, RouterLink, Header, NavigationTabs],
  templateUrl: './vacancy.html',
  styleUrl: './vacancy.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Vacancy {
  private readonly currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  private readonly dateFmt = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });

  protected readonly year = new Date().getFullYear();
  protected readonly stars = [1, 2, 3, 4, 5];

  protected readonly tabs: Tab[] = [
    { id: 'search', label: 'Buscar vagas' },
    { id: 'chat', label: 'Chat' },
    { id: 'requests', label: 'Solicitações', badge: 3 },
    { id: 'reviews', label: 'Avaliações', badge: 7 },
    { id: 'profile', label: 'Seus dados' },
  ];

  protected readonly activeTab = signal<TabId>('search');

  private readonly jobs = signal<Job[]>([
    {
      id: 1,
      role: 'Garçom',
      category: 'Restaurante',
      company: 'Mana Poke',
      location: 'Mogi das Cruzes',
      date: daysFromToday(0),
      start: '19:00',
      end: '23:00',
      price: 150,
      rating: 5,
      description:
        'Atendimento às mesas no salão, anotação de pedidos e apoio ao caixa em noite de alto movimento.',
    },
    {
      id: 2,
      role: 'Segurança',
      category: 'Segurança',
      company: 'Centro Educacional Flor de Íris',
      location: 'Poá',
      date: daysFromToday(1),
      start: '06:00',
      end: '13:00',
      price: 100,
      rating: 4,
      description:
        'Controle de acesso na portaria e ronda pelas áreas comuns durante o período da manhã.',
    },
    {
      id: 3,
      role: 'Entregador',
      category: 'Motoboy',
      company: 'Rápido Express',
      location: 'Suzano',
      date: daysFromToday(3),
      start: '11:00',
      end: '15:00',
      price: 120,
      rating: 4.5,
      description: 'Entregas na região central. É necessário ter moto própria e CNH categoria A.',
    },
    {
      id: 4,
      role: 'Ajudante de obras',
      category: 'Obras',
      company: 'Construtora Horizonte',
      location: 'Mogi das Cruzes',
      date: daysFromToday(5),
      start: '07:00',
      end: '16:00',
      price: 180,
      rating: 3.5,
      description: 'Apoio ao mestre de obras em reforma residencial. EPI fornecido pela empresa.',
    },
    {
      id: 5,
      role: 'Recepcionista',
      category: 'Eventos',
      company: 'Buffet Estrela',
      location: 'Poá',
      date: daysFromToday(12),
      start: '18:00',
      end: '00:00',
      price: 130,
      rating: 5,
      description: 'Recepção de convidados em festa de casamento. Traje social preto.',
    },
    {
      id: 6,
      role: 'Atendente',
      category: 'Food truck',
      company: 'Burger na Rua',
      location: 'Suzano',
      date: daysFromToday(20),
      start: '17:00',
      end: '22:00',
      price: 90,
      rating: 4,
      description: 'Atendimento no balcão e montagem de lanches em feira gastronômica.',
    },
  ]);

  // Filtros em edição (sidebar) e filtros aplicados (lista)
  protected readonly location = signal(EMPTY_FILTERS.location);
  protected readonly category = signal(EMPTY_FILTERS.category);
  protected readonly date = signal<DateFilter>(EMPTY_FILTERS.date);
  protected readonly price = signal<PriceFilter>(EMPTY_FILTERS.price);
  protected readonly minRating = signal(EMPTY_FILTERS.minRating);
  private readonly applied = signal<Filters>(EMPTY_FILTERS);

  protected readonly visibleCount = signal(PAGE_SIZE);
  protected readonly expandedId = signal<number | null>(null);
  protected readonly appliedJobIds = signal<ReadonlySet<number>>(new Set());
  protected readonly filtersOpen = signal(false);

  protected readonly locations = computed(() => unique(this.jobs().map((j) => j.location)));
  protected readonly categories = computed(() => unique(this.jobs().map((j) => j.category)));

  protected readonly activeFilterCount = computed(() => {
    const f = this.applied();
    return (Object.keys(f) as (keyof Filters)[]).filter((k) => f[k] !== EMPTY_FILTERS[k]).length;
  });

  private readonly filteredJobs = computed(() => {
    const f = this.applied();
    const today = daysFromToday(0);
    const limit = { any: null, today: today, week: daysFromToday(7), month: daysFromToday(30) }[f.date];

    return this.jobs().filter(
      (job) =>
        (f.location === 'any' || job.location === f.location) &&
        (f.category === 'any' || job.category === f.category) &&
        (limit === null || (job.date >= today && job.date <= limit)) &&
        matchesPrice(job.price, f.price) &&
        job.rating >= f.minRating,
    );
  });

  protected readonly totalResults = computed(() => this.filteredJobs().length);

  protected readonly visibleJobs = computed(() =>
    this.filteredJobs()
      .slice(0, this.visibleCount())
      .map((job) => ({
        ...job,
        priceLabel: this.currency.format(job.price),
        dateLabel: this.dateFmt.format(new Date(`${job.date}T12:00:00`)),
        initials: job.company
          .split(' ')
          .slice(0, 2)
          .map((w) => w[0])
          .join('')
          .toUpperCase(),
      })),
  );

  protected readonly hasMore = computed(() => this.visibleCount() < this.totalResults());

  protected selectTab(id: TabId): void {
    this.activeTab.set(id);
  }

  protected applyFilters(): void {
    this.applied.set({
      location: this.location(),
      category: this.category(),
      date: this.date(),
      price: this.price(),
      minRating: Number(this.minRating()),
    });
    this.visibleCount.set(PAGE_SIZE);
    this.filtersOpen.set(false);
  }

  protected clearFilters(): void {
    this.location.set(EMPTY_FILTERS.location);
    this.category.set(EMPTY_FILTERS.category);
    this.date.set(EMPTY_FILTERS.date);
    this.price.set(EMPTY_FILTERS.price);
    this.minRating.set(EMPTY_FILTERS.minRating);
    this.applyFilters();
  }

  protected toggleFilters(): void {
    this.filtersOpen.update((open) => !open);
  }

  protected toggleDetails(id: number): void {
    this.expandedId.update((current) => (current === id ? null : id));
  }

  protected apply(id: number): void {
    this.appliedJobIds.update((ids) => new Set(ids).add(id));
  }

  protected loadMore(): void {
    this.visibleCount.update((n) => n + PAGE_SIZE);
  }
}

function unique(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

function matchesPrice(price: number, filter: PriceFilter): boolean {
  switch (filter) {
    case 'upTo100':
      return price <= 100;
    case '100to150':
      return price > 100 && price <= 150;
    case 'over150':
      return price > 150;
    default:
      return true;
  }
}
