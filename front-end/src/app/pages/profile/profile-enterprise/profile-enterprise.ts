import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBuilding,
  faEnvelope,
  faFileSignature,
  faIdCard,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';
import { ProfileField, ProfileSection } from '../profile-section';

/** Formulário com os dados editáveis da empresa (sem a senha). */
export function buildEnterpriseForm(fb: FormBuilder) {
  return fb.group({
    nome: ['', [Validators.required, Validators.minLength(2)]],
    razaoSocial: ['', [Validators.required, Validators.minLength(3)]],
    cnpj: [
      '',
      [Validators.required, Validators.pattern(/^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/)],
    ],
    email: ['', [Validators.required, Validators.email]],
    endereco: ['', Validators.required],
  });
}

@Component({
  selector: 'app-profile-enterprise',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  templateUrl: '../profile-section.html',
  styleUrl: '../profile-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileEnterprise extends ProfileSection {
  protected readonly titleId = 'enterprise-personal-title';
  protected readonly title = 'Dados da empresa';
  protected readonly description =
    'Essas informações identificam sua empresa para os freelancers nas suas vagas.';
  protected readonly sectionIcon = faBuilding;

  protected readonly fields: ProfileField[] = [
    {
      key: 'nome',
      label: 'Nome fantasia',
      icon: faBuilding,
      placeholder: 'Como sua empresa é conhecida',
      autocomplete: 'organization',
      error: 'Informe o nome da empresa (mínimo 2 caracteres).',
    },
    {
      key: 'razaoSocial',
      label: 'Razão social',
      icon: faFileSignature,
      placeholder: 'Razão social registrada',
      error: 'Informe a razão social (mínimo 3 caracteres).',
    },
    {
      key: 'cnpj',
      label: 'CNPJ',
      icon: faIdCard,
      placeholder: '00.000.000/0000-00',
      error: 'Informe um CNPJ válido (14 dígitos).',
    },
    {
      key: 'email',
      label: 'E-mail',
      icon: faEnvelope,
      type: 'email',
      placeholder: 'contato@empresa.com',
      autocomplete: 'email',
      error: 'Informe um e-mail válido.',
    },
    {
      key: 'endereco',
      label: 'Endereço',
      icon: faLocationDot,
      placeholder: 'Rua, número - Bairro - Cidade/UF',
      autocomplete: 'street-address',
      error: 'Informe o endereço da empresa.',
      full: true,
    },
  ];
}
