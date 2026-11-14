import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { Footer } from '../../../../components/footer/footer';
import { Header } from '../../../../components/header/header';
import { EnterpriseService } from '../../../../service/enterprise/enterprise';

interface Empresa {
  name: string;
  email: string;
  password: string;
}

type Feedback = { type: 'error' | 'success' | 'info'; message: string } | null;

const SESSION_KEY = 'empresaLogada';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, Header, Footer, FontAwesomeModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  protected readonly icons = {
    arrow: faArrowRight,
    building: faBuilding,
    check: faCheck,
    envelope: faEnvelope,
    eye: faEye,
    eyeSlash: faEyeSlash,
    lock: faLock,
    success: faCircleCheck,
    error: faCircleExclamation,
    info: faCircleInfo,
  };

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);

  protected readonly showPassword = signal(false);
  protected readonly submitted = signal(false);
  protected readonly loading = signal(false);
  protected readonly feedback = signal<Feedback>(null);

  constructor(
    private enterpriseService: EnterpriseService
  ) { }

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

  protected login(): void {
    this.submitted.set(true);
    this.feedback.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();

    this.loading.set(true);

    this.enterpriseService.login(email, password).subscribe({
      next: (empresa) => {
        this.loading.set(false);
        localStorage.setItem(SESSION_KEY, JSON.stringify(empresa));
        this.router.navigate(['/gerenciar-vagas']);
      },

      error: (erro) => {
        this.loading.set(false);
        this.feedback.set({
          type: 'error',
          message: 'Falha ao efetuar login. Verifique suas credenciais.',
        });
      }
    })
  }

}
