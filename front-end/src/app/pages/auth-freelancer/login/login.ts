import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faEye, faEyeSlash, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { Footer } from '../../../components/footer/footer';
import { Header } from '../../../components/header/header';

interface Usuario {
  name: string;
  email: string;
  password: string;
}

type Feedback = { type: 'error' | 'success' | 'info'; message: string } | null;

const USERS_KEY = 'usuarios';
const SESSION_KEY = 'usuarioLogado';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, Header, Footer, FontAwesomeModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  protected readonly faGoogle = faGoogle;
  protected readonly faFacebook = faFacebook;
  protected readonly faEye = faEye;
  protected readonly faEyeSlash = faEyeSlash;
  protected readonly faEnvelope = faEnvelope;
  protected readonly faLock = faLock;
  protected readonly faUser = faUser;

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);

  protected readonly showPassword = signal(false);
  protected readonly submitted = signal(false);
  protected readonly loading = signal(false);
  protected readonly feedback = signal<Feedback>(null);

  protected readonly form = this.fb.group({
    email: [this.emailFromNavigation(), [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [true],
  });

  constructor() {
    if (this.form.controls.email.value) {
      this.feedback.set({ type: 'success', message: 'Conta criada! Agora é só entrar com sua senha.' });
    }
  }

  protected togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  protected showError(control: 'email' | 'password'): boolean {
    const c = this.form.controls[control];
    return c.invalid && (c.touched || this.submitted());
  }

  protected forgotPassword(): void {
    this.feedback.set({
      type: 'info',
      message: 'A recuperação de senha estará disponível em breve.',
    });
  }

  protected socialLogin(provider: string): void {
    this.feedback.set({ type: 'info', message: `O login com ${provider} estará disponível em breve.` });
  }

  protected login(): void {
    this.submitted.set(true);
    this.feedback.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();
    this.withLoading(() => {
      const usuario = this.getUsuarios().find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
      );

      if (!usuario) {
        this.feedback.set({ type: 'error', message: 'E-mail ou senha inválidos.' });
        return;
      }

      localStorage.setItem(SESSION_KEY, JSON.stringify(usuario));
      this.router.navigate(['/home']);
    });
  }

  /** E-mail enviado pelo cadastro via `router.navigate(..., { state: { email } })`. */
  private emailFromNavigation(): string {
    const state = inject(Router).getCurrentNavigation()?.extras.state as { email?: string } | undefined;
    return state?.email ?? '';
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
}
