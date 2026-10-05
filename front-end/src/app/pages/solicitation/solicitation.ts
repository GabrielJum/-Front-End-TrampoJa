import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../../components/header/header';
import { NavigationTabs } from '../../components/navigation-tabs/navigation-tabs';
import { Footer } from '../../components/footer/footer';

type Status = 'confirmed' | 'review' | 'canceled';
type StatusFilter = 'all' | Status;

interface Request {
  id: number;
  jobId: number;
  role: string;
  category: string;
  company: string;
  companyType: string;
  logoUrl?: string;
  status: Status;
  sentAt: string; // ISO yyyy-mm-dd
  date: string; // ISO yyyy-mm-dd
  period: string;
  start: string; // HH:mm
  end: string; // HH:mm
  price: number;
  rating: number;
  summary: string;
  requirements: string[];
  address: string;
}

const STATUS_INFO: Record<Status, { label: string; message: string }> = {
  confirmed: {
    label: 'Confirmado',
    message: 'Você foi aprovado! Chegue com 15 minutos de antecedência.',
  },
  review: {
    label: 'Em análise',
    message: 'A empresa está avaliando seu perfil. Você será avisado pelo chat.',
  },
  canceled: {
    label: 'Cancelado',
    message: 'Esta solicitação foi cancelada. Que tal procurar vagas parecidas?',
  },
};

const REQUESTS: Request[] = [
  {
    id: 1,
    jobId: 1,
    role: 'Garçom',
    category: 'Restaurante',
    company: 'Mana Poke',
    companyType: 'Empresa de Restaurante',
    status: 'confirmed',
    sentAt: '2026-05-12',
    date: '2026-05-20',
    period: 'Noite',
    start: '19:00',
    end: '23:00',
    price: 150,
    rating: 5,
    summary:
      'Estamos selecionando profissionais para reforçar nossa equipe de salão em um evento/noite especial no dia 20 de maio, no período noturno.',
    requirements: [
      'Pessoas ágeis, comunicativas e com foco no bom atendimento.',
      'Preferência por quem já tem experiência na função, mas se você não tiver e possuir muito empenho, proatividade e vontade de aprender rápido, a vaga também pode ser sua!',
    ],
    address: 'Rua João Cardoso Pereira, 258 - Parque Monte Líbano - Mogi das Cruzes/SP',
  },
  {
    id: 2,
    jobId: 7,
    role: 'Ajudante geral',
    category: 'Serviços gerais',
    company: 'Souza Empresa',
    companyType: 'Empresa de Logística',
    status: 'review',
    sentAt: '2026-05-14',
    date: '2026-05-23',
    period: 'Manhã',
    start: '08:00',
    end: '14:00',
    price: 110,
    rating: 4,
    summary:
      'Buscamos ajudante para apoio na organização do estoque e carga/descarga de mercadorias durante o sábado.',
    requirements: [
      'Disposição para atividades que exigem esforço físico.',
      'Pontualidade e trabalho em equipe.',
    ],
    address: 'Av. Brasil, 1020 - Centro - Suzano/SP',
  },
  {
    id: 3,
    jobId: 8,
    role: 'Recepcionista',
    category: 'Eventos',
    company: 'Eventos e CIA',
    companyType: 'Empresa de Eventos',
    status: 'canceled',
    sentAt: '2026-05-08',
    date: '2026-05-16',
    period: 'Tarde',
    start: '14:00',
    end: '20:00',
    price: 130,
    rating: 4.5,
    summary:
      'Recepção de convidados e controle de lista em evento corporativo no salão azul.',
    requirements: [
      'Boa comunicação e simpatia no atendimento.',
      'Traje social preto.',
    ],
    address: 'Rua do Mercado, 45 - Vila Industrial - Poá/SP',
  },
];

@Component({
  selector: 'app-solicitation',
  imports: [RouterLink, Header, NavigationTabs, Footer],
  templateUrl: './solicitation.html',
  styleUrl: './solicitation.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Solicitation {
  private readonly currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  private readonly dateFmt = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });
  private readonly shortDateFmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' });

  protected readonly year = new Date().getFullYear();
  protected readonly stars = [1, 2, 3, 4, 5];

  private readonly requests = signal<Request[]>(REQUESTS);

  protected readonly filter = signal<StatusFilter>('all');
  protected readonly selectedId = signal<number | null>(REQUESTS[0]?.id ?? null);

  protected readonly filters = computed(() => {
    const all = this.requests();
    const count = (s: Status) => all.filter((r) => r.status === s).length;
    return [
      { id: 'all' as StatusFilter, label: 'Todas', count: all.length },
      { id: 'confirmed' as StatusFilter, label: STATUS_INFO.confirmed.label, count: count('confirmed') },
      { id: 'review' as StatusFilter, label: STATUS_INFO.review.label, count: count('review') },
      { id: 'canceled' as StatusFilter, label: STATUS_INFO.canceled.label, count: count('canceled') },
    ];
  });

  protected readonly visibleRequests = computed(() => {
    const f = this.filter();
    return this.requests()
      .filter((r) => f === 'all' || r.status === f)
      .map((r) => ({
        ...r,
        statusLabel: STATUS_INFO[r.status].label,
        sentLabel: this.shortDateFmt.format(toDate(r.sentAt)),
        initials: initials(r.company),
      }));
  });

  protected readonly selected = computed(() => {
    const list = this.visibleRequests();
    const req = list.find((r) => r.id === this.selectedId()) ?? list[0];
    if (!req) return null;

    return {
      ...req,
      statusMessage: STATUS_INFO[req.status].message,
      priceLabel: this.currency.format(req.price),
      dateLabel: this.dateFmt.format(toDate(req.date)),
      city: req.address.split(' - ').at(-1),
      mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(req.address)}`,
      steps: [
        { label: 'Enviada', done: true },
        { label: 'Em análise', done: req.status !== 'canceled' },
        {
          label: req.status === 'canceled' ? 'Cancelada' : 'Confirmada',
          done: req.status !== 'review',
        },
      ],
    };
  });

  protected setFilter(id: StatusFilter): void {
    this.filter.set(id);
  }

  protected select(id: number): void {
    this.selectedId.set(id);
  }

  protected cancel(id: number): void {
    this.requests.update((list) =>
      list.map((r) => (r.id === id ? { ...r, status: 'canceled' as Status } : r)),
    );
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
