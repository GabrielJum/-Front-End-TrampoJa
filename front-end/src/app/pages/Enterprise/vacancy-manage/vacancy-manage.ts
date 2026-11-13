import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBan,
  faBriefcase,
  faCalendarDays,
  faChevronDown,
  faCircleCheck,
  faClock,
  faFolderOpen,
  faLocationDot,
  faMagnifyingGlass,
  faPen,
  faPlus,
  faRotateLeft,
  faTriangleExclamation,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { Footer } from '../../../components/footer/footer';
import { Header } from '../../../components/header/header';
import { NavigationTabs } from '../../../components/navigation-tabs/navigation-tabs';
import {
  ModalCreateVacancy,
  VacancyFormValue,
} from '../../../components/modal-create-vacancy/modal-create-vacancy';

type JobStatus = 'open' | 'closed';
type StatusFilter = 'all' | JobStatus;
interface CompanyJob extends VacancyFormValue {
  id: number;
  status: JobStatus;
  candidates: number;
}

const STORAGE_KEY = 'vagasEmpresa';
const SESSION_KEY = 'empresaLogada';

function daysFromToday(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Mock até a integração com a API
const SEED: CompanyJob[] = [
  {
    id: 1,
    role: 'Garçom',
    category: 'Restaurante',
    location: 'Mogi das Cruzes',
    address: 'Rua João Cardoso Pereira, 258 - Parque Monte Líbano - Mogi das Cruzes/SP',
    date: daysFromToday(2),
    period: 'Noite',
    start: '19:00',
    end: '23:00',
    price: 150,
    summary:
      'Estamos selecionando profissionais para reforçar nossa equipe de salão em uma noite de alto movimento.',
    requirements: [
      'Pessoas ágeis, comunicativas e com foco no bom atendimento.',
      'Experiência na função é um diferencial.',
    ],
    status: 'open',
    candidates: 12,
  },
  {
    id: 2,
    role: 'Recepcionista',
    category: 'Eventos',
    location: 'Poá',
    address: 'Av. Brasil, 1200 - Centro - Poá/SP',
    date: daysFromToday(9),
    period: 'Noite',
    start: '18:00',
    end: '00:00',
    price: 130,
    summary: 'Recepção de convidados em festa de casamento.',
    requirements: ['Traje social preto.', 'Boa comunicação.'],
    status: 'open',
    candidates: 5,
  },
  {
    id: 3,
    role: 'Segurança',
    category: 'Segurança',
    location: 'Suzano',
    address: 'Rua General Francisco Glicério, 450 - Centro - Suzano/SP',
    date: daysFromToday(-6),
    period: 'Manhã',
    start: '06:00',
    end: '13:00',
    price: 100,
    summary: 'Controle de acesso na portaria e ronda pelas áreas comuns.',
    requirements: ['Curso de vigilante em dia.'],
    status: 'closed',
    candidates: 8,
  },
];

@Component({
  selector: 'app-vacancy-manage',
  imports: [Header, Footer, FontAwesomeModule, NavigationTabs, ModalCreateVacancy],
  templateUrl: './vacancy-manage.html',
  styleUrl: './vacancy-manage.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'closeDialogs()' },
})
export class VacancyManage {
  protected readonly icons = {
    ban: faBan,
    briefcase: faBriefcase,
    calendar: faCalendarDays,
    chevron: faChevronDown,
    check: faCircleCheck,
    clock: faClock,
    empty: faFolderOpen,
    location: faLocationDot,
    search: faMagnifyingGlass,
    pen: faPen,
    plus: faPlus,
    reopen: faRotateLeft,
    warning: faTriangleExclamation,
    users: faUsers,
  };

  private readonly currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  private readonly dateFmt = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });


  private readonly jobs = signal<CompanyJob[]>(this.loadJobs());

  protected readonly statusFilter = signal<StatusFilter>('all');
  protected readonly search = signal('');
  protected readonly expandedId = signal<number | null>(null);

  protected readonly editingJob = signal<CompanyJob | null>(null);
  protected readonly formOpen = signal(false);
  protected readonly closingJob = signal<CompanyJob | null>(null);
  protected readonly toast = signal<string | null>(null);
  private toastTimer?: ReturnType<typeof setTimeout>;

  protected readonly stats = computed(() => {
    const jobs = this.jobs();
    const open = jobs.filter((j) => j.status === 'open');
    return {
      total: jobs.length,
      open: open.length,
      closed: jobs.length - open.length,
      candidates: open.reduce((sum, j) => sum + j.candidates, 0),
    };
  });

  protected readonly filters = computed(() => {
    const s = this.stats();
    return [
      { id: 'all' as const, label: 'Todas', count: s.total },
      { id: 'open' as const, label: 'Abertas', count: s.open },
      { id: 'closed' as const, label: 'Encerradas', count: s.closed },
    ];
  });

  protected readonly visibleJobs = computed(() => {
    const status = this.statusFilter();
    const term = this.search().trim().toLowerCase();

    return this.jobs()
      .filter(
        (job) =>
          (status === 'all' || job.status === status) &&
          (!term || `${job.role} ${job.category} ${job.location}`.toLowerCase().includes(term)),
      )
      .sort((a, b) => (a.status === b.status ? a.date.localeCompare(b.date) : a.status === 'open' ? -1 : 1))
      .map((job) => ({
        ...job,
        priceLabel: this.currency.format(job.price),
        dateLabel: this.dateFmt.format(new Date(`${job.date}T12:00:00`)),
        duration: durationInHours(job.start, job.end),
      }));
  });

  constructor() {
    effect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(this.jobs())));
  }

  protected setFilter(filter: StatusFilter): void {
    this.statusFilter.set(filter);
  }

  protected onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  protected toggleDetails(id: number): void {
    this.expandedId.update((current) => (current === id ? null : id));
  }

  // ---------- Criar / editar ----------
  protected openCreate(): void {
    this.editingJob.set(null);
    this.formOpen.set(true);
  }

  protected openEdit(job: CompanyJob): void {
    this.editingJob.set(job);
    this.formOpen.set(true);
  }

  protected save(data: VacancyFormValue): void {
    const editing = this.editingJob();
    if (editing === null) {
      const nextId = Math.max(0, ...this.jobs().map((j) => j.id)) + 1;
      this.jobs.update((jobs) => [{ ...data, id: nextId, status: 'open', candidates: 0 }, ...jobs]);
      this.showToast('Vaga publicada com sucesso!');
    } else {
      this.jobs.update((jobs) => jobs.map((j) => (j.id === editing.id ? { ...j, ...data } : j)));
      this.showToast('Vaga atualizada.');
    }

    this.formOpen.set(false);
  }

  // ---------- Encerrar / reabrir ----------
  protected askClose(job: CompanyJob): void {
    this.closingJob.set(job);
  }

  protected confirmClose(): void {
    const job = this.closingJob();
    if (!job) return;
    this.setStatus(job.id, 'closed');
    this.closingJob.set(null);
    this.showToast('Vaga encerrada. Ela não aparece mais para os freelancers.');
  }

  protected reopen(job: CompanyJob): void {
    this.setStatus(job.id, 'open');
    this.showToast('Vaga reaberta.');
  }

  protected closeDialogs(): void {
    this.formOpen.set(false);
    this.closingJob.set(null);
  }

  private setStatus(id: number, status: JobStatus): void {
    this.jobs.update((jobs) => jobs.map((j) => (j.id === id ? { ...j, status } : j)));
  }

  private showToast(message: string): void {
    clearTimeout(this.toastTimer);
    this.toast.set(message);
    this.toastTimer = setTimeout(() => this.toast.set(null), 3500);
  }

  private loadJobs(): CompanyJob[] {
    const dados = localStorage.getItem(STORAGE_KEY);
    return dados ? JSON.parse(dados) : SEED;
  }


}

function durationInHours(start: string, end: string): number {
  const toMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  let diff = toMinutes(end) - toMinutes(start);
  if (diff <= 0) diff += 24 * 60;
  return Math.round((diff / 60) * 10) / 10;
}
