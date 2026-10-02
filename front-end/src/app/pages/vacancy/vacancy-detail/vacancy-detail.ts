import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { Header } from '../../../components/header/header';
import { NavigationTabs } from '../../../components/navigation-tabs/navigation-tabs';

interface JobDetail {
  id: number;
  role: string;
  category: string;
  company: string;
  companyType: string;
  logoUrl?: string;
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

// Mock até a integração com a API
const JOBS: JobDetail[] = [
  {
    id: 1,
    role: 'Garçom',
    category: 'Restaurante',
    company: 'Mana Poke',
    companyType: 'Empresa de Restaurante',
    date: '2026-05-20',
    period: 'Noite',
    start: '19:00',
    end: '23:00',
    price: 120,
    rating: 5,
    summary:
      'Estamos selecionando profissionais para reforçar nossa equipe de salão em um evento/noite especial no dia 20 de maio, no período noturno.',
    requirements: [
      'Pessoas ágeis, comunicativas e com foco no bom atendimento.',
      'Preferência por quem já tem experiência na função, mas se você não tiver e possuir muito empenho, proatividade e vontade de aprender rápido, a vaga também pode ser sua!',
    ],
    address: 'Rua João Cardoso Pereira, 258 - Parque Monte Líbano - Mogi das Cruzes/SP',
  },
];

@Component({
  selector: 'app-vacancy-detail',
  imports: [RouterLink, Header, NavigationTabs],
  templateUrl: './vacancy-detail.html',
  styleUrl: './vacancy-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VacancyDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  private readonly dateFmt = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  protected readonly year = new Date().getFullYear();
  protected readonly stars = [1, 2, 3, 4, 5];

  private readonly id = toSignal(this.route.paramMap.pipe(map((p) => Number(p.get('id')))), {
    initialValue: 0,
  });

  protected readonly applied = signal(false);

  protected readonly job = computed(() => {
    const job = JOBS.find((j) => j.id === this.id());
    if (!job) return null;

    return {
      ...job,
      priceLabel: this.currency.format(job.price),
      dateLabel: this.dateFmt.format(new Date(`${job.date}T12:00:00`)),
      duration: durationInHours(job.start, job.end),
      initials: job.company
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase(),
      city: job.address.split(' - ').at(-1),
      mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.address)}`,
    };
  });

  protected apply(): void {
    this.applied.set(true);
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
