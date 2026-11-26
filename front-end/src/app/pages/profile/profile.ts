import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBriefcase, faBuilding, faCircleCheck, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { finalize, Observable } from 'rxjs';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { AuthService } from '../../service/auth/auth';
import { EnterpriseService } from '../../service/enterprise/enterprise';
import { FreelancerService } from '../../service/freelancer/freelancer';
import { TooltipService } from '../../service/tooltip/tooltip';
import { Enterprise } from '../../model/enterprise';
import { Freelancer } from '../../model/freelancer';
import { isEmptyValue } from './profile-section';
import { buildFreelancerForm, ProfileFreelancer } from './profile-freelancer/profile-freelancer';
import { buildEnterpriseForm, ProfileEnterprise } from './profile-enterprise/profile-enterprise';

type PasswordField = 'newPassword' | 'currentPassword';
type ProfileData = Enterprise | Freelancer;

const MIN_PASSWORD = 6;

/** Exige a senha atual sempre que uma nova senha for informada. */
function currentPasswordRequired(group: AbstractControl): ValidationErrors | null {
  const next = group.get('newPassword')?.value;
  const current = group.get('currentPassword')?.value;
  return next && !current ? { currentPasswordRequired: true } : null;
}

/** Compara valores do formulário com os da API ignorando null/'' e espaços. */
function sameValue(a: unknown, b: unknown): boolean {
  const normalize = (v: unknown) => (v === null || v === undefined ? '' : String(v).trim());
  return normalize(a) === normalize(b);
}

@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    FontAwesomeModule,
    Header,
    Footer,
    ProfileFreelancer,
    ProfileEnterprise,
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile-form.css', './profile.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly enterpriseService = inject(EnterpriseService);
  private readonly freelancerService = inject(FreelancerService);
  private readonly tooltip = inject(TooltipService);
  private readonly router = inject(Router);

  protected readonly minPassword = MIN_PASSWORD;
  protected readonly role = this.auth.role();

  protected readonly icons = {
    freelancer: faBriefcase,
    enterprise: faBuilding,
    complete: faCircleCheck,
    pending: faTriangleExclamation,
  };

  /** Dados do usuário: começa com o que está salvo no login e é atualizado pela API. */
  protected readonly data = signal<ProfileData | null>(this.auth.user()?.data ?? null);
  protected readonly loading = signal(false);

  /** Grupo de dados pessoais — os campos dependem da role do usuário. */
  protected readonly personal: FormGroup =
    this.role === 'Empresa'
      ? buildEnterpriseForm(inject(FormBuilder))
      : buildFreelancerForm(inject(FormBuilder));

  protected readonly form = this.fb.group(
    {
      personal: this.personal,
      newPassword: ['', Validators.minLength(MIN_PASSWORD)],
      currentPassword: [''],
    },
    { validators: currentPasswordRequired },
  );

  private readonly value = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });
  private readonly status = toSignal(this.form.statusChanges, { initialValue: this.form.status });

  protected readonly visible = signal<Record<PasswordField, boolean>>({
    newPassword: false,
    currentPassword: false,
  });
  protected readonly saving = signal(false);
  protected readonly saved = signal(false);
  protected readonly submitted = signal(false);

  private readonly personalKeys = Object.keys(this.personal.controls);

  /** Campos sem dados cadastrados na API. */
  protected readonly pending = computed(() => {
    const data = this.data();
    return this.personalKeys.filter((key) => isEmptyValue(this.field(data, key)));
  });

  protected readonly initials = computed(() =>
    (this.data()?.nome ?? '')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase(),
  );

  protected readonly dirty = computed(() => {
    const v = this.value();
    const data = this.data();
    const personal = (v.personal ?? {}) as Record<string, unknown>;
    const personalChanged = this.personalKeys.some(
      (key) => !sameValue(personal[key], this.field(data, key)),
    );
    return personalChanged || !!v.newPassword || !!v.currentPassword;
  });

  protected readonly canSave = computed(() => this.dirty() && this.status() === 'VALID' && !this.saving());

  /** 0 a 4 — força aproximada da nova senha. */
  protected readonly strength = computed(() => {
    const pwd = this.value().newPassword ?? '';
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= MIN_PASSWORD) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score++;
    return Math.max(score, 1);
  });

  protected readonly strengthLabel = computed(
    () => ['', 'Fraca', 'Razoável', 'Boa', 'Forte'][this.strength()],
  );

  protected readonly strengthBars = [1, 2, 3, 4];

  ngOnInit(): void {
    this.discard();
    this.loadProfile();
  }

  protected showError(control: string): boolean {
    const c = this.form.get(control);
    return !!c && c.invalid && (c.touched || this.submitted());
  }

  protected get currentPasswordMissing(): boolean {
    const c = this.form.controls.currentPassword;
    return this.form.hasError('currentPasswordRequired') && (c.touched || this.submitted());
  }

  protected toggleVisibility(field: PasswordField): void {
    this.visible.update((v) => ({ ...v, [field]: !v[field] }));
  }

  protected logout(): void {
    this.auth.logout();
    this.router.navigate(['/home']);
  }

  protected discard(): void {
    const data = this.data();
    const personal = Object.fromEntries(
      this.personalKeys.map((key) => [key, this.field(data, key) ?? null]),
    );
    this.form.reset({ personal, newPassword: '', currentPassword: '' });
    this.submitted.set(false);
    this.saved.set(false);
  }

  protected save(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (!this.canSave()) return;

    this.saving.set(true);
    const personal = this.personal.getRawValue();

    // TODO: chamar o PUT de empresa/freelancer quando o endpoint existir
    setTimeout(() => {
      this.data.update((d) => (d ? { ...d, ...personal } : d));
      this.saving.set(false);
      this.discard();
      this.saved.set(true);
      setTimeout(() => this.saved.set(false), 3500);
    }, 700);
  }

  private loadProfile(): void {
    const user = this.auth.user();
    const id = user?.data.id;
    if (!user || id === undefined) return;

    const request$: Observable<ProfileData> =
      user.role === 'Empresa'
        ? this.enterpriseService.buscarEmpresa(id)
        : this.freelancerService.buscarFreelancer(id);

    this.loading.set(true);
    request$.pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (data) => {
        // Não sobrescreve o que o usuário já começou a editar
        const wasDirty = this.dirty();
        this.data.set(data);
        if (!wasDirty) this.discard();
      },
      error: () => this.tooltip.error('Não foi possível carregar seus dados.'),
    });
  }

  private field(data: ProfileData | null, key: string): unknown {
    return data ? (data as unknown as Record<string, unknown>)[key] : undefined;
  }
}
