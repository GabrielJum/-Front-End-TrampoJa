import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faDollarSign,
  faEnvelope,
  faFileLines,
  faIdCard,
  faListCheck,
  faLocationDot,
  faPhone,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { ProfileField, ProfileSection } from '../profile-section';

/** Formulário com os dados editáveis do freelancer (sem a senha). */
export function buildFreelancerForm(fb: FormBuilder) {
  return fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/)]],
    telefone: ['', [Validators.required, Validators.pattern(/^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/)]],
    endereco: ['', Validators.required],
    valorHora: [null as number | null, [Validators.required, Validators.min(1)]],
    resumo: ['', [Validators.required, Validators.minLength(20)]],
    habilidades: ['', Validators.required],
  });
}

@Component({
  selector: 'app-profile-freelancer',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  templateUrl: '../profile-section.html',
  styleUrl: '../profile-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileFreelancer extends ProfileSection {
  protected readonly titleId = 'freelancer-personal-title';
  protected readonly title = 'Informações pessoais';
  protected readonly description =
    'Seus dados aparecem para as empresas quando você se candidata a uma vaga.';
  protected readonly sectionIcon = faUser;

  protected readonly fields: ProfileField[] = [
    {
      key: 'nome',
      label: 'Nome completo',
      icon: faUser,
      placeholder: 'Seu nome completo',
      autocomplete: 'name',
      error: 'Informe seu nome completo (mínimo 3 caracteres).',
    },
    {
      key: 'email',
      label: 'E-mail',
      icon: faEnvelope,
      type: 'email',
      placeholder: 'voce@email.com',
      autocomplete: 'email',
      error: 'Informe um e-mail válido.',
    },
    {
      key: 'cpf',
      label: 'CPF',
      icon: faIdCard,
      placeholder: '000.000.000-00',
      error: 'Informe um CPF válido (11 dígitos).',
    },
    {
      key: 'telefone',
      label: 'Telefone',
      icon: faPhone,
      type: 'tel',
      placeholder: '(11) 91234-5678',
      autocomplete: 'tel',
      error: 'Informe um telefone válido com DDD.',
    },
    {
      key: 'endereco',
      label: 'Endereço',
      icon: faLocationDot,
      placeholder: 'Rua, número - Bairro - Cidade/UF',
      autocomplete: 'street-address',
      error: 'Informe seu endereço.',
    },
    {
      key: 'valorHora',
      label: 'Valor por hora (R$)',
      icon: faDollarSign,
      type: 'number',
      placeholder: 'Ex.: 25',
      error: 'Informe um valor por hora maior que zero.',
    },
    {
      key: 'resumo',
      label: 'Resumo profissional',
      icon: faFileLines,
      type: 'textarea',
      placeholder: 'Conte um pouco sobre sua experiência',
      error: 'Escreva um resumo com pelo menos 20 caracteres.',
      full: true,
    },
    {
      key: 'habilidades',
      label: 'Habilidades',
      icon: faListCheck,
      type: 'textarea',
      placeholder: 'Ex.: atendimento ao cliente, caixa, inglês intermediário',
      error: 'Informe pelo menos uma habilidade.',
      full: true,
    },
  ];
}
