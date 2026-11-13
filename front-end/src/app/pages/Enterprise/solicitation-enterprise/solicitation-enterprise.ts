import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBriefcase,
  faCalendarDays,
  faCheck,
  faClock,
  faComments,
  faDollarSign,
  faInbox,
  faLocationDot,
  faRotateLeft,
  faStar,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FilterChips } from '../../../components/filter-chips/filter-chips';
import { Address } from '../../../components/address/address';
import { Footer } from '../../../components/footer/footer';
import { Header } from '../../../components/header/header';
import { NavigationTabs } from '../../../components/navigation-tabs/navigation-tabs';
import { StatusVacancy, VacancyStatus } from '../../../components/status-vacancy/status-vacancy';

type Status = VacancyStatus;
type StatusFilter = 'all' | Status;

interface Candidate {
  id: number;
  name: string;
  avatarUrl?: string;
  city: string;
  rating: number;
  completedJobs: number;
  bio: string;
  skills: string[];
}

interface Application {
  id: number;
  status: Status;
  sentAt: string; // ISO yyyy-mm-dd
  candidate: Candidate;
  job: {
    id: number;
    role: string;
    category: string;
    date: string; // ISO yyyy-mm-dd
    period: string;
    start: string; // HH:mm
    end: string; // HH:mm
    price: number;
    address: string;
  };
}

const STATUS_INFO: Record<Status, { label: string; message: string }> = {
  confirmed: {
    label: 'Confirmado',
    message: 'Candidato confirmado! Combine os últimos detalhes pelo chat.',
  },
  review: {
    label: 'Em análise',
    message: 'Este candidato aguarda sua decisão. Confirme ou recuse a candidatura.',
  },
  canceled: {
    label: 'Recusado',
    message: 'Você recusou esta candidatura. O candidato foi avisado.',
  },
};

const GARCOM = {
  id: 1,
  role: 'Garçom',
  category: 'Restaurante',
  date: '2026-05-20',
  period: 'Noite',
  start: '19:00',
  end: '23:00',
  price: 150,
  address: 'Rua João Cardoso Pereira, 258 - Parque Monte Líbano - Mogi das Cruzes/SP',
};

const RECEPCIONISTA = {
  id: 2,
  role: 'Recepcionista',
  category: 'Eventos',
  date: '2026-05-23',
  period: 'Noite',
  start: '18:00',
  end: '00:00',
  price: 130,
  address: 'Av. Brasil, 1200 - Centro - Poá/SP',
};

// Mock até a integração com a API
const APPLICATIONS: Application[] = [
  {
    id: 1,
    status: 'review',
    sentAt: '2026-05-12',
    job: GARCOM,
    candidate: {
      id: 10,
      name: 'Lucas Andrade',
      city: 'Mogi das Cruzes/SP',
      rating: 4.8,
      completedJobs: 32,
      bio: 'Trabalho há 3 anos com atendimento em restaurantes e eventos. Gosto de ambientes movimentados e tenho facilidade para lidar com o público.',
      skills: [
        'Experiência como garçom em restaurantes e buffets.',
        'Conhecimento em comandas eletrônicas e apoio ao caixa.',
      ],
    },
  },
  {
    id: 2,
    status: 'confirmed',
    sentAt: '2026-05-11',
    job: GARCOM,
    candidate: {
      id: 11,
      name: 'Juliana Ramos',
      city: 'Suzano/SP',
      rating: 5,
      completedJobs: 58,
      bio: 'Garçonete com experiência em casamentos e eventos corporativos. Pontual, organizada e comunicativa.',
      skills: ['Serviço à francesa e à americana.', 'Curso de atendimento ao cliente (Senac).'],
    },
  },
  {
    id: 3,
    status: 'review',
    sentAt: '2026-05-15',
    job: RECEPCIONISTA,
    candidate: {
      id: 12,
      name: 'Marcos Vieira',
      city: 'Poá/SP',
      rating: 4.2,
      completedJobs: 9,
      bio: 'Estudante de administração, já trabalhei como recepcionista em feiras e congressos.',
      skills: ['Controle de lista de convidados.', 'Inglês intermediário.'],
    },
  },
  {
    id: 4,
    status: 'canceled',
    sentAt: '2026-05-09',
    job: RECEPCIONISTA,
    candidate: {
      id: 13,
      name: 'Bianca Souza',
      city: 'Itaquaquecetuba/SP',
      rating: 3.9,
      completedJobs: 4,
      bio: 'Procuro oportunidades na área de eventos para ganhar experiência.',
      skills: ['Boa comunicação.', 'Disponibilidade aos fins de semana.'],
    },
  },
];

@Component({
  selector: 'app-solicitation-enterprise',
  imports: [RouterLink, Header, NavigationTabs, Footer, FontAwesomeModule, StatusVacancy, FilterChips, Address],
  templateUrl: './solicitation-enterprise.html',
  styleUrl: './solicitation-enterprise.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitationEnterprise {
  protected readonly icons = {
    briefcase: faBriefcase,
    calendar: faCalendarDays,
    check: faCheck,
    chat: faComments,
    clock: faClock,
    empty: faInbox,
    location: faLocationDot,
    money: faDollarSign,
    reopen: faRotateLeft,
    star: faStar,
    close: faXmark,
  };

  private readonly currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  private readonly dateFmt = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });
  private readonly shortDateFmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' });

  protected readonly stars = [1, 2, 3, 4, 5];

  private readonly applications = signal<Application[]>(APPLICATIONS);

  protected readonly filter = signal<StatusFilter>('all');
  protected readonly jobFilter = signal<number | null>(null);
  protected readonly selectedId = signal<number | null>(APPLICATIONS[0]?.id ?? null);

  protected readonly jobs = computed(() => {
    const unique = new Map(this.applications().map((a) => [a.job.id, a.job.role]));
    return [...unique].map(([id, role]) => ({ id, role }));
  });

  private readonly byJob = computed(() => {
    const jobId = this.jobFilter();
    return this.applications().filter((a) => jobId === null || a.job.id === jobId);
  });

  protected readonly filters = computed(() => {
    const all = this.byJob();
    const count = (s: Status) => all.filter((a) => a.status === s).length;
    return [
      { id: 'all' as StatusFilter, label: 'Todas', count: all.length },
      { id: 'review' as StatusFilter, label: STATUS_INFO.review.label, count: count('review') },
      { id: 'confirmed' as StatusFilter, label: STATUS_INFO.confirmed.label, count: count('confirmed') },
      { id: 'canceled' as StatusFilter, label: STATUS_INFO.canceled.label, count: count('canceled') },
    ];
  });

  protected readonly visibleApplications = computed(() => {
    const f = this.filter();
    return this.byJob()
      .filter((a) => f === 'all' || a.status === f)
      .map((a) => ({
        ...a,
        statusLabel: STATUS_INFO[a.status].label,
        sentLabel: this.shortDateFmt.format(toDate(a.sentAt)),
        initials: initials(a.candidate.name),
      }));
  });

  protected readonly selected = computed(() => {
    const list = this.visibleApplications();
    const app = list.find((a) => a.id === this.selectedId()) ?? list[0];
    if (!app) return null;

    return {
      ...app,
      statusMessage: STATUS_INFO[app.status].message,
      priceLabel: this.currency.format(app.job.price),
      dateLabel: this.dateFmt.format(toDate(app.job.date)),
      steps: [
        { label: 'Recebida', done: true },
        { label: 'Em análise', done: app.status !== 'canceled' },
        {
          label: app.status === 'canceled' ? 'Recusada' : 'Confirmada',
          done: app.status !== 'review',
        },
      ],
    };
  });

  protected setFilter(id: StatusFilter): void {
    this.filter.set(id);
  }

  protected setJobFilter(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.jobFilter.set(value ? Number(value) : null);
  }

  protected select(id: number): void {
    this.selectedId.set(id);
  }

  protected confirm(id: number): void {
    this.setStatus(id, 'confirmed');
  }

  protected decline(id: number): void {
    this.setStatus(id, 'canceled');
  }

  protected reconsider(id: number): void {
    this.setStatus(id, 'review');
  }

  private setStatus(id: number, status: Status): void {
    this.applications.update((list) => list.map((a) => (a.id === id ? { ...a, status } : a)));
    // Mantém o candidato aberto mesmo que ele saia do filtro atual
    if (this.filter() !== 'all' && this.filter() !== status) this.filter.set('all');
    this.selectedId.set(id);
  }
}

function toDate(iso: string): Date {
  return new Date(`${iso}T12:00:00`);
}

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}
