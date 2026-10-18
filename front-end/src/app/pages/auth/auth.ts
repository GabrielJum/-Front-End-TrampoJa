import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGoogle, faFacebook  } from '@fortawesome/free-brands-svg-icons';
import { faEye, faEyeSlash, faUser, faEnvelope, faLock, faShieldHalved  } from '@fortawesome/free-solid-svg-icons';

interface Usuario {
  name: string;
  email: string;
  password: string;
}

type Mode = 'login' | 'register';
type Feedback = { type: 'error' | 'success' | 'info'; message: string } | null;

const MIN_PASSWORD = 6;
const USERS_KEY = 'usuarios';
const SESSION_KEY = 'usuarioLogado';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const { password, confirmPassword } = group.value;
  return confirmPassword && password !== confirmPassword ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, NgTemplateOutlet, Header, Footer, FontAwesomeModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})

export class Auth {
  faGoogle = faGoogle;
  faFacebook = faFacebook;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faUser = faUser;
  faEnvelope = faEnvelope
  faLock = faLock;
  faShieldHalved = faShieldHalved;

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);

  protected readonly minPassword = MIN_PASSWORD;

  protected readonly mode = signal<Mode>('login');
  protected readonly showPassword = signal(false);
  protected readonly submitted = signal(false);
  protected readonly loading = signal(false);
  protected readonly feedback = signal<Feedback>(null);

  protected readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [true],
  });

  protected readonly registerForm = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(MIN_PASSWORD)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue],
    },
    { validators: passwordsMatch },
  );

  protected setMode(mode: Mode): void {
    if (this.mode() === mode) return;
    this.mode.set(mode);
    this.submitted.set(false);
    this.showPassword.set(false);
    this.feedback.set(null);
  }

  protected togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  protected showError(form: 'login' | 'register', control: string): boolean {
    const group: AbstractControl = form === 'login' ? this.loginForm : this.registerForm;
    const c = group.get(control);
    return !!c && c.invalid && (c.touched || this.submitted());
  }

  protected get mismatch(): boolean {
    const c = this.registerForm.controls.confirmPassword;
    return this.registerForm.hasError('passwordMismatch') && (c.touched || this.submitted());
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
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.getRawValue();
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

  protected register(): void {
    this.submitted.set(true);
    this.feedback.set(null);
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { name, email, password } = this.registerForm.getRawValue();
    this.withLoading(() => {
      const usuarios = this.getUsuarios();
      if (usuarios.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        this.feedback.set({ type: 'error', message: 'Já existe uma conta com esse e-mail.' });
        return;
      }

      this.salvarUsuarios([...usuarios, { name: name.trim(), email, password }]);
      this.registerForm.reset();
      this.loginForm.reset({ email, password: '', remember: true });
      this.setMode('login');
      this.feedback.set({ type: 'success', message: 'Conta criada! Agora é só entrar com sua senha.' });
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
