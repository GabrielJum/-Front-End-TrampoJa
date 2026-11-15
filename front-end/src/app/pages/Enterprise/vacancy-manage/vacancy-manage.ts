import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCalendarDays,
  faChevronDown,
  faClock,
  faFolderOpen,
  faLocationDot,
  faPen,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { Footer } from '../../../components/footer/footer';
import { Header } from '../../../components/header/header';
import { NavigationTabs } from '../../../components/navigation-tabs/navigation-tabs';
import {
  ModalCreateVacancy,
  Period,
  VacancyFormValue,
} from '../../../components/modal-create-vacancy/modal-create-vacancy';
import { ModalAlert } from '../../../components/modal-alert/modal-alert';
import { VacancyService } from '../../../service/vacancy/vacancy';
import { TooltipService } from '../../../service/tooltip/tooltip';
import { AuthService } from '../../../service/auth/auth';
import { Turno, VacancyType } from '../../../model/vacancy';

const TURNO_POR_PERIODO: Record<Period, Turno> = {
  Manhã: 'MANHA',
  Tarde: 'TARDE',
  Noite: 'NOITE',
  Madrugada: 'NOITE',
};

const PERIODO_POR_TURNO: Record<Turno, Period> = {
  MANHA: 'Manhã',
  TARDE: 'Tarde',
  NOITE: 'Noite',
};

@Component({
  selector: 'app-vacancy-manage',
  imports: [Header, Footer, FontAwesomeModule, NavigationTabs, ModalCreateVacancy, ModalAlert],
  templateUrl: './vacancy-manage.html',
  styleUrl: './vacancy-manage.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'closeDialogs()' },
})
export class VacancyManage {
  private readonly vacancyService = inject(VacancyService);
  private readonly tooltip = inject(TooltipService);
  private readonly auth = inject(AuthService);
  private readonly empresaId = this.auth.enterprise()?.id ?? null;

  protected readonly icons = {
    calendar: faCalendarDays,
    chevron: faChevronDown,
    clock: faClock,
    empty: faFolderOpen,
    location: faLocationDot,
    pen: faPen,
    plus: faPlus,
    trash: faTrash,
  };

  protected readonly vagas = signal<VacancyType[]>([]);
  protected readonly expandedId = signal<number | null>(null);

  protected readonly formOpen = signal(false);
  protected readonly editingVaga = signal<VacancyType | null>(null);
  protected readonly editingForm = signal<VacancyFormValue | null>(null);
  protected readonly deletingVaga = signal<VacancyType | null>(null);

  constructor() {
    if(this.empresaId === null) {
      this.tooltip.error('Sessão expirada. Faça login novamente.');
      return;
    }

    this.carregarVagas(this.empresaId);
  }

  private carregarVagas(empresaId: number): void {
    this.vacancyService.listarVagas(empresaId).subscribe({
      next: (vagas) => this.vagas.set(vagas.filter((v) => v.empresaId === this.empresaId)),
      error: () => this.tooltip.error('Não foi possível carregar as vagas.'),
    });
  }

  protected toggleDetails(id: number): void {
    this.expandedId.update((current) => (current === id ? null : id));
  }

  protected openCreate(): void {
    this.editingVaga.set(null);
    this.editingForm.set(null);
    this.formOpen.set(true);
  }

  protected openEdit(vaga: VacancyType): void {
    this.editingVaga.set(vaga);
    this.editingForm.set(toForm(vaga));
    this.formOpen.set(true);
  }

  protected save(data: VacancyFormValue): void {
    if (this.empresaId === null) {
      this.tooltip.error('Sessão expirada. Faça login novamente.');
      return;
    }

    const editing = this.editingVaga();
    const payload = toPayload(data, this.empresaId, editing?.estado);

    const request = editing?.id
      ? this.vacancyService.editarVaga(editing.id, payload)
      : this.vacancyService.criarVaga(payload);

    request.subscribe({
      next: () => {
        this.formOpen.set(false);
        this.tooltip.success(editing ? 'Vaga atualizada.' : 'Vaga publicada com sucesso!');
        this.carregarVagas(this.empresaId || 0);
      },
      error: () => this.tooltip.error('Não foi possível salvar a vaga. Tente novamente.'),
    });
  }

  protected askDelete(vaga: VacancyType): void {
    this.deletingVaga.set(vaga);
  }

  protected confirmDelete(): void {
    const vaga = this.deletingVaga();
    if (!vaga?.id) return;

    this.vacancyService.excluirVaga(vaga.id).subscribe({
      next: () => {
        this.deletingVaga.set(null);
        this.tooltip.success('Vaga excluída.');
        this.carregarVagas(this.empresaId || 0);
      },
      error: () => this.tooltip.error('Não foi possível excluir a vaga.'),
    });
  }

  protected closeDialogs(): void {
    this.formOpen.set(false);
    this.deletingVaga.set(null);
  }
}

// Formulário do modal -> JSON da API
function toPayload(data: VacancyFormValue, empresaId: number, estado = 'SP'): VacancyType {
  return {
    empresaId,
    titulo: data.role,
    categoria: data.category,
    valor: data.price,
    tipoRemuneracao: 'DIARIA',
    data: data.date,
    turno: TURNO_POR_PERIODO[data.period],
    horaInicio: data.start,
    horaFim: data.end,
    descricao: data.summary,
    requisitos: data.requirements,
    endereco: data.address,
    cidade: data.location,
    estado,
  };
}

// JSON da API -> formulário do modal (para edição)
function toForm(vaga: VacancyType): VacancyFormValue {
  return {
    role: vaga.titulo,
    category: vaga.categoria,
    location: vaga.cidade,
    address: vaga.endereco,
    date: vaga.data,
    period: PERIODO_POR_TURNO[vaga.turno],
    start: vaga.horaInicio,
    end: vaga.horaFim,
    price: vaga.valor,
    summary: vaga.descricao,
    requirements: vaga.requisitos,
  };
}
