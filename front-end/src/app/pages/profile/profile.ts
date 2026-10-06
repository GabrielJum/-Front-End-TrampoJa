import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

interface UserProfile {
  name: string;
  email: string;
  memberSince: string; // ISO yyyy-mm-dd
}

type PasswordField = 'newPassword' | 'currentPassword';

const MIN_PASSWORD = 6;

// TODO: substituir pelo usuário autenticado quando houver integração com a API
const CURRENT_USER: UserProfile = {
  name: 'Rodrigo Silva de Carvalho',
  email: 'rodrigosilva@email.com',
  memberSince: '2025-03-14',
};

/** Exige a senha atual sempre que uma nova senha for informada. */
function currentPasswordRequired(group: AbstractControl): ValidationErrors | null {
  const next = group.get('newPassword')?.value;
  const current = group.get('currentPassword')?.value;
  return next && !current ? { currentPasswordRequired: true } : null;
}

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, Header, Footer],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly sinceFmt = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });

  protected readonly minPassword = MIN_PASSWORD;

  protected readonly user = signal<UserProfile>(CURRENT_USER);

  protected readonly form = this.fb.group(
    {
      name: [CURRENT_USER.name, [Validators.required, Validators.minLength(3)]],
      email: [CURRENT_USER.email, [Validators.required, Validators.email]],
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

  protected readonly initials = computed(() =>
    (this.value().name || this.user().name)
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase(),
  );

  protected readonly memberSince = computed(() =>
    this.sinceFmt.format(new Date(`${this.user().memberSince}T12:00:00`)),
  );

  protected readonly dirty = computed(() => {
    const v = this.value();
    const u = this.user();
    return v.name !== u.name || v.email !== u.email || !!v.newPassword || !!v.currentPassword;
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

  protected discard(): void {
    const u = this.user();
    this.form.reset({ name: u.name, email: u.email, newPassword: '', currentPassword: '' });
    this.submitted.set(false);
    this.saved.set(false);
  }

  protected save(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (!this.canSave()) return;

    this.saving.set(true);
    const { name, email } = this.form.getRawValue();

    // TODO: chamar o serviço de usuário (PUT /usuarios/me)
    setTimeout(() => {
      this.user.update((u) => ({ ...u, name, email }));
      this.saving.set(false);
      this.discard();
      this.saved.set(true);
      setTimeout(() => this.saved.set(false), 3500);
    }, 700);
  }
}
