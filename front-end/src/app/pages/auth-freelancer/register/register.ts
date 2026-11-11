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
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
  faShieldHalved,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { Footer } from '../../../components/footer/footer';
import { Header } from '../../../components/header/header';

interface Usuario {
  name: string;
  email: string;
  password: string;
}

type Feedback = { type: 'error' | 'success' | 'info'; message: string } | null;
type Field = 'name' | 'email' | 'password' | 'confirmPassword' | 'terms';

const MIN_PASSWORD = 6;
const USERS_KEY = 'usuarios';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const { password, confirmPassword } = group.value;
  return confirmPassword && password !== confirmPassword ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, Header, Footer, FontAwesomeModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
  protected readonly faGoogle = faGoogle;
  protected readonly faFacebook = faFacebook;
  protected readonly faEye = faEye;
  protected readonly faEyeSlash = faEyeSlash;
  protected readonly faUser = faUser;
  protected readonly faEnvelope = faEnvelope;
  protected readonly faLock = faLock;
  protected readonly faShieldHalved = faShieldHalved;

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
      password: ['', [Validators.required, Validators.minLength(MIN_PASSWORD)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue],
    },
    { validators: passwordsMatch },
  );

  protected togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  protected showError(control: Field): boolean {
    const c = this.form.controls[control];
    return c.invalid && (c.touched || this.submitted());
  }

  protected get mismatch(): boolean {
    const c = this.form.controls.confirmPassword;
    return this.form.hasError('passwordMismatch') && (c.touched || this.submitted());
  }

  protected socialLogin(provider: string): void {
    this.feedback.set({ type: 'info', message: `O cadastro com ${provider} estará disponível em breve.` });
  }

  protected register(): void {
    this.submitted.set(true);
    this.feedback.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email, password } = this.form.getRawValue();
    this.withLoading(() => {
      const usuarios = this.getUsuarios();
      if (usuarios.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        this.feedback.set({ type: 'error', message: 'Já existe uma conta com esse e-mail.' });
        return;
      }

      this.salvarUsuarios([...usuarios, { name: name.trim(), email, password }]);
      this.router.navigate(['/freelancers/login'], { state: { email } });
    });
  }

  private withLoading(action: () => void): void {
    this.loading.set(true);
    // Simula a latência da API enquanto a autenticação usa o localStorage
    setTimeout(() => {
      action();
      this.loading.set(false);
    }, 500);
  }

  private getUsuarios(): Usuario[] {
    const dados = localStorage.getItem(USERS_KEY);
    return dados ? JSON.parse(dados) : [];
  }

  private salvarUsuarios(lista: Usuario[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(lista));
  }
}
