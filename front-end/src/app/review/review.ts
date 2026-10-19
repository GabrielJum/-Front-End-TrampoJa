import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCalendarDays,
  faChevronDown,
  faCircleCheck,
  faClock,
  faHandshake,
  faHourglassHalf,
  faInbox,
  faLocationDot,
  faPaperPlane,
  faPeopleGroup,
  faQuoteLeft,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { Footer } from '../components/footer/footer';
import { Header } from '../components/header/header';
import { NavigationTabs } from '../components/navigation-tabs/navigation-tabs';

type CriterionId = 'location' | 'commitment' | 'environment';
type ReviewFilter = 'all' | 'pending' | 'done';
type Scores = Record<CriterionId, number>;

interface ReviewItem {
  id: number;
  role: string;
  company: string;
  companyType: string;
  logoUrl?: string;
  date: string; // ISO yyyy-mm-dd
  period: string;
  start: string; // HH:mm
  end: string; // HH:mm
  scores: Scores | null; // null = avaliação não realizada
  comment: string;
}

const PAGE_SIZE = 3;
const MAX_COMMENT = 500;

const EMPTY_SCORES: Scores = { location: 0, commitment: 0, environment: 0 };

const SCORE_LABELS = ['', 'Péssimo', 'Ruim', 'Regular', 'Bom', 'Excelente'];

const REVIEWS: ReviewItem[] = [
  {
    id: 1,
    role: 'Garçom',
    company: 'Mana Poke',
    companyType: 'Empresa de Restaurante',
    date: '2026-05-20',
    period: 'Noite',
    start: '19:00',
    end: '23:00',
    scores: null,
    comment: '',
  },
  {
    id: 2,
    role: 'Ajudante geral',
    company: 'Souza Empresa',
    companyType: 'Empresa de Logística',
    date: '2026-05-23',
    period: 'Manhã',
    start: '08:00',
    end: '14:00',
    scores: null,
    comment: '',
  },
  {
    id: 3,
    role: 'Recepcionista',
    company: 'Eventos e CIA',
    companyType: 'Empresa de Eventos',
    date: '2026-05-16',
    period: 'Tarde',
    start: '14:00',
    end: '20:00',
    scores: { location: 4, commitment: 5, environment: 4 },
    comment:
      'Local de fácil acesso, pagamento feito no mesmo dia como combinado e equipe muito receptiva.',
  },
  {
    id: 4,
    role: 'Entregador',
    company: 'Rápido Express',
    companyType: 'Empresa de Entregas',
    date: '2026-05-02',
    period: 'Tarde',
    start: '11:00',
    end: '15:00',
    scores: null,
    comment: '',
  },
];

@Component({
  selector: 'app-review',
  imports: [FormsModule, FontAwesomeModule, Header, NavigationTabs, Footer],
  templateUrl: './review.html',
  styleUrl: './review.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Review {
  private readonly dateFmt = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });

  protected readonly icons = {
    calendar: faCalendarDays,
    chevron: faChevronDown,
    done: faCircleCheck,
    clock: faClock,
    pending: faHourglassHalf,
    empty: faInbox,
    send: faPaperPlane,
    quote: faQuoteLeft,
    star: faStar,
  };

  protected readonly criteria = [
    { id: 'location' as CriterionId, label: 'Localização', hint: 'Facilidade de acesso ao local', icon: faLocationDot },
    { id: 'commitment' as CriterionId, label: 'Compromisso', hint: 'Pagou o combinado e cumpriu o horário', icon: faHandshake },
    { id: 'environment' as CriterionId, label: 'Ambiente de trabalho', hint: 'Respeito e funções combinadas', icon: faPeopleGroup },
  ];

  protected readonly stars = [1, 2, 3, 4, 5];
  protected readonly scoreLabels = SCORE_LABELS;
  protected readonly maxComment = MAX_COMMENT;

  private readonly reviews = signal<ReviewItem[]>(REVIEWS);

  protected readonly filter = signal<ReviewFilter>('all');
  protected readonly visibleCount = signal(PAGE_SIZE);
  protected readonly selectedId = signal<number | null>(REVIEWS[0]?.id ?? null);

  protected readonly draft = signal<Scores>(EMPTY_SCORES);
  protected readonly hovered = signal<{ id: CriterionId; value: number } | null>(null);
  protected readonly comment = signal('');

  protected readonly filters = computed(() => {
    const all = this.reviews();
    const pending = all.filter((r) => !r.scores).length;
    return [
      { id: 'all' as ReviewFilter, label: 'Todas', count: all.length },
      { id: 'pending' as ReviewFilter, label: 'Pendentes', count: pending },
      { id: 'done' as ReviewFilter, label: 'Realizadas', count: all.length - pending },
    ];
  });

  private readonly filteredReviews = computed(() => {
    const f = this.filter();
    return this.reviews().filter((r) => f === 'all' || (f === 'pending' ? !r.scores : !!r.scores));
  });

  protected readonly visibleReviews = computed(() =>
    this.filteredReviews()
      .slice(0, this.visibleCount())
      .map((r) => ({ ...r, initials: initials(r.company) })),
  );

  protected readonly hasMore = computed(() => this.visibleCount() < this.filteredReviews().length);

  protected readonly selected = computed(() => {
    const list = this.visibleReviews();
    const review = list.find((r) => r.id === this.selectedId()) ?? list[0];
    if (!review) return null;

    return {
      ...review,
      dateLabel: this.dateFmt.format(new Date(`${review.date}T12:00:00`)),
      average: review.scores ? average(review.scores) : null,
    };
  });

  protected readonly draftAverage = computed(() => average(this.draft()));

  protected readonly canSubmit = computed(() =>
    Object.values(this.draft()).every((v) => v > 0),
  );

  protected setFilter(id: ReviewFilter): void {
    this.filter.set(id);
    this.visibleCount.set(PAGE_SIZE);
    this.resetDraft();
  }

  protected select(id: number): void {
    if (id === this.selected()?.id) return;
    this.selectedId.set(id);
    this.resetDraft();
  }

  protected loadMore(): void {
    this.visibleCount.update((n) => n + PAGE_SIZE);
  }

  protected displayScore(id: CriterionId): number {
    const hover = this.hovered();
    return hover?.id === id ? hover.value : this.draft()[id];
  }

  protected rate(id: CriterionId, value: number): void {
    this.draft.update((scores) => ({ ...scores, [id]: value }));
  }

  protected submit(): void {
    const review = this.selected();
    if (!review || !this.canSubmit()) return;

    const scores = this.draft();
    const comment = this.comment().trim();
    this.reviews.update((list) =>
      list.map((r) => (r.id === review.id ? { ...r, scores, comment } : r)),
    );
    this.resetDraft();
  }

  private resetDraft(): void {
    this.draft.set(EMPTY_SCORES);
    this.hovered.set(null);
    this.comment.set('');
  }
}

function average(scores: Scores): number {
  const values = Object.values(scores).filter((v) => v > 0);
  if (!values.length) return 0;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
}

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}
