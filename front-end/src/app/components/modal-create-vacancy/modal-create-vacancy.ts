import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export type Period = 'Manhã' | 'Tarde' | 'Noite' | 'Madrugada';

export interface VacancyFormValue {
  role: string;
  category: string;
  location: string;
  address: string;
  date: string; // ISO yyyy-mm-dd
  period: Period;
  start: string; // HH:mm
  end: string; // HH:mm
  price: number;
  summary: string;
  requirements: string[];
}

type FormField = 'role' | 'category' | 'location' | 'address' | 'date' | 'start' | 'end' | 'price' | 'summary';

export const CATEGORIES = ['Segurança', 'Eventos', 'Motoboy', 'Obras', 'Food truck', 'Restaurante'];
export const PERIODS: Period[] = ['Manhã', 'Tarde', 'Noite', 'Madrugada'];

function todayIso(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

@Component({
  selector: 'app-modal-create-vacancy',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './modal-create-vacancy.html',
  styleUrl: './modal-create-vacancy.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalCreateVacancy implements OnInit {
  /** Vaga a ser editada. Quando `null`, o modal cria uma nova vaga. */
  readonly vacancy = input<VacancyFormValue | null>(null);

  readonly save = output<VacancyFormValue>();
  readonly close = output<void>();

  protected readonly closeIcon = faXmark;
  protected readonly categories = CATEGORIES;
  protected readonly periods = PERIODS;
  protected readonly today = todayIso();

  protected readonly isEditing = computed(() => this.vacancy() !== null);
  protected readonly submitted = signal(false);

  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly form = this.fb.group({
    role: ['', [Validators.required, Validators.minLength(3)]],
    category: [CATEGORIES[0], Validators.required],
    location: ['', Validators.required],
    address: ['', Validators.required],
    date: ['', Validators.required],
    period: [PERIODS[0] as Period, Validators.required],
    start: ['', Validators.required],
    end: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(1)]],
    summary: ['', [Validators.required, Validators.minLength(10)]],
    requirements: [''],
  });

  ngOnInit(): void {
    const vacancy = this.vacancy();
    if (vacancy) {
      this.form.reset({ ...vacancy, requirements: vacancy.requirements.join('\n') });
    }
  }

  protected showError(control: FormField): boolean {
    const c = this.form.controls[control];
    return c.invalid && (c.touched || this.submitted());
  }

  protected onSubmit(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { requirements, ...values } = this.form.getRawValue();
    this.save.emit({
      ...values,
      role: values.role.trim(),
      price: Number(values.price),
      requirements: requirements
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean),
    });
  }

  protected onClose(): void {
    this.close.emit();
  }
}
