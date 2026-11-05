import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import {
  faBuilding,
  faCircleCheck,
  faClock,
  faEnvelope,
  faHeadset,
  faPaperPlane,
  faPen,
  faPhone,
  faRotateLeft,
  faTag,
  faUser,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons';
import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';

type Profile = 'freelancer' | 'empresa';
type Field = 'name' | 'email' | 'subject' | 'message';

const CONTACT_EMAIL = 'contato@trampoja.com';
const CONTACT_PHONE = '(11) 94234-3131';
const MESSAGE_MAX = 1000;

const SUBJECTS = [
  'Dúvida sobre a plataforma',
  'Problema com minha conta',
  'Pagamentos',
  'Denúncia',
  'Parcerias',
  'Sugestão',
  'Outro assunto',
];

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, Header, Footer, FontAwesomeModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  protected readonly icons = {
    building: faBuilding,
    check: faCircleCheck,
    envelope: faEnvelope,
    headset: faHeadset,
    send: faPaperPlane,
    pen: faPen,
    reset: faRotateLeft,
    tag: faTag,
    user: faUser,
    freelancer: faUserTie,
  };

  protected readonly channels = [
    {
      icon: faEnvelope,
      title: 'E-mail',
      value: CONTACT_EMAIL,
      href: `mailto:${CONTACT_EMAIL}`,
    },
    {
      icon: faWhatsapp,
      title: 'WhatsApp',
      value: CONTACT_PHONE,
      href: `https://wa.me/55${CONTACT_PHONE.replace(/\D/g, '')}`,
    },
    {
      icon: faPhone,
      title: 'Telefone',
      value: CONTACT_PHONE,
      href: `tel:+55${CONTACT_PHONE.replace(/\D/g, '')}`,
    },
  ];

  protected readonly hoursIcon = faClock;
  protected readonly subjects = SUBJECTS;
  protected readonly messageMax = MESSAGE_MAX;
  protected readonly contactEmail = CONTACT_EMAIL;

  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly submitted = signal(false);
  protected readonly sent = signal(false);

  protected readonly form = this.fb.group({
    profile: ['freelancer' as Profile],
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(MESSAGE_MAX)]],
  });

  private readonly message = toSignal(this.form.controls.message.valueChanges, { initialValue: '' });
  protected readonly messageLength = computed(() => this.message().length);

  protected setProfile(profile: Profile): void {
    this.form.controls.profile.setValue(profile);
  }

  protected showError(control: Field): boolean {
    const c = this.form.controls[control];
    return c.invalid && (c.touched || this.submitted());
  }

  protected send(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { profile, name, email, subject, message } = this.form.getRawValue();
    const body = [
      message.trim(),
      '',
      '---',
      `Nome: ${name.trim()}`,
      `E-mail: ${email}`,
      `Perfil: ${profile === 'empresa' ? 'Empresa' : 'Freelancer'}`,
    ].join('\n');

    // Abre o app de e-mail do usuário com a mensagem pronta (sem backend de envio por enquanto)
    window.location.href =
      `mailto:${CONTACT_EMAIL}` +
      `?subject=${encodeURIComponent(`[TrampoJá] ${subject}`)}` +
      `&body=${encodeURIComponent(body)}`;

    this.sent.set(true);
  }

  protected reset(): void {
    this.form.reset();
    this.submitted.set(false);
    this.sent.set(false);
  }
}
