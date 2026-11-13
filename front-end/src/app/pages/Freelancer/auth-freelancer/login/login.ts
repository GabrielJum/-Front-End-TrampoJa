import { FreelancerService } from '../../../../service/freelancer/freelancer';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faEye, faEyeSlash, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { Footer } from '../../../../components/footer/footer';
import { Header } from '../../../../components/header/header';

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

  constructor(private freelancerService: FreelancerService) {}

  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [true],
  });

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

    this.withLoading( () => {
      this.freelancerService.login(email, password).subscribe({
      next: (freelancer) => {
        localStorage.setItem(SESSION_KEY, JSON.stringify(freelancer));
        this.router.navigate(['/vagas']);
      },

      error: (err) => {
        this.feedback.set({ type: 'error', message: 'Email ou senha inválidos.' });
      }
    });
    })

  }

  private withLoading(action: () => void): void {
    this.loading.set(true);

    setTimeout(() => {
      action();
      this.loading.set(false);
    }, 500);
  }
}
