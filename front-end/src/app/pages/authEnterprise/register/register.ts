import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowRight,
  faBuilding,
  faCheck,
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
  faEnvelope,
  faEye,
  faEyeSlash,
  faIdCard,
  faLock,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';
import { Footer } from '../../../components/footer/footer';
import { Header } from '../../../components/header/header';

interface Empresa {
  name: string;
  email: string;
  cnpj: string;
  password: string;
}

type Feedback = { type: 'error' | 'success' | 'info'; message: string } | null;
type Field = 'name' | 'email' | 'cnpj' | 'password' | 'confirmPassword' | 'terms';

const MIN_PASSWORD = 6;
const COMPANIES_KEY = 'empresas';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const { password, confirmPassword } = group.value;
  return confirmPassword && password !== confirmPassword ? { passwordMismatch: true } : null;
}

/** Valida o CNPJ pelos dígitos verificadores (aceita com ou sem máscara). */
function cnpjValidator(control: AbstractControl): ValidationErrors | null {
  const digits = String(control.value ?? '').replace(/\D/g, '');
  if (!digits) return null;
  if (digits.length !== 14 || /^(\d)\1+$/.test(digits)) return { cnpj: true };

  const checkDigit = (length: number): number => {
    const weights = length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const sum = weights.reduce((acc, w, i) => acc + Number(digits[i]) * w, 0);
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  return checkDigit(12) === Number(digits[12]) && checkDigit(13) === Number(digits[13])
    ? null
    : { cnpj: true };
}

function formatCnpj(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, Header, Footer, FontAwesomeModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
  protected readonly icons = {
    arrow: faArrowRight,
    building: faBuilding,
    check: faCheck,
    envelope: faEnvelope,
    eye: faEye,
    eyeSlash: faEyeSlash,
    idCard: faIdCard,
    lock: faLock,
    shield: faShieldHalved,
    success: faCircleCheck,
    error: faCircleExclamation,
    info: faCircleInfo,
  };

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);

  protected readonly minPassword = MIN_PASSWORD;

  protected readonly showPassword = signal(false);
  protected readonly submitted = signal(false);
  protected readonly loading = signal(false);
  protected readonly feedback = signal<Feedback>(null);

  protected readonly form = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      cnpj: ['', [Validators.required, cnpjValidator]],
      password: ['', [Validators.required, Validators.minLength(MIN_PASSWORD)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue],
    },
    { validators: passwordsMatch },
  );

  protected togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  protected onCnpjInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formatted = formatCnpj(input.value);
    input.value = formatted;
    this.form.controls.cnpj.setValue(formatted, { emitEvent: false });
  }

  protected showError(control: Field): boolean {
    const c = this.form.controls[control];
    return c.invalid && (c.touched || this.submitted());
  }

  protected get mismatch(): boolean {
    const c = this.form.controls.confirmPassword;
    return this.form.hasError('passwordMismatch') && (c.touched || this.submitted());
  }

  protected register(): void {
    this.submitted.set(true);
    this.feedback.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email, cnpj, password } = this.form.getRawValue();
    this.loading.set(true);
    // Simula a latência da API enquanto o cadastro usa o localStorage
    setTimeout(() => {
      const empresas = this.getEmpresas();
      const cnpjDigits = cnpj.replace(/\D/g, '');

      if (empresas.some((e) => e.email.toLowerCase() === email.toLowerCase())) {
        this.loading.set(false);
        this.feedback.set({ type: 'error', message: 'Já existe uma empresa com esse e-mail.' });
        return;
      }

      if (empresas.some((e) => e.cnpj === cnpjDigits)) {
        this.loading.set(false);
        this.feedback.set({ type: 'error', message: 'Esse CNPJ já está cadastrado.' });
        return;
      }

      localStorage.setItem(
        COMPANIES_KEY,
        JSON.stringify([...empresas, { name: name.trim(), email, cnpj: cnpjDigits, password }]),
      );
      this.feedback.set({
        type: 'success',
        message: 'Empresa cadastrada! Redirecionando para o login...',
      });
      setTimeout(() => this.router.navigate(['/empresas/login']), 1500);
    }, 500);
  }

  private getEmpresas(): Empresa[] {
    const dados = localStorage.getItem(COMPANIES_KEY);
    return dados ? JSON.parse(dados) : [];
  }
}
