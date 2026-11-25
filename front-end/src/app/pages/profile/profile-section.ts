import { computed, Directive, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  faCircleExclamation,
  faTriangleExclamation,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

/** Configuração de um campo exibido nas seções de dados do perfil. */
export interface ProfileField {
  key: string;
  label: string;
  icon: IconDefinition;
  placeholder: string;
  /** Mensagem exibida quando o campo é inválido. */
  error: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'textarea';
  autocomplete?: string;
  /** Ocupa a linha inteira do grid. */
  full?: boolean;
}

/** Um campo é considerado pendente quando ainda não tem valor cadastrado. */
export function isEmptyValue(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'number') return value <= 0;
  return String(value).trim() === '';
}

/**
 * Lógica comum às seções de dados do freelancer e da empresa.
 * O formulário pertence à página de perfil, que o repassa via `group`.
 */
@Directive()
export abstract class ProfileSection {
  readonly group = input.required<FormGroup>();
  /** Chaves dos campos que ainda não têm dados cadastrados. */
  readonly pending = input<readonly string[]>([]);
  readonly submitted = input(false);

  protected abstract readonly titleId: string;
  protected abstract readonly title: string;
  protected abstract readonly description: string;
  protected abstract readonly sectionIcon: IconDefinition;
  protected abstract readonly fields: ProfileField[];

  protected readonly statusIcons = {
    warning: faTriangleExclamation,
    pending: faCircleExclamation,
  };

  protected readonly pendingLabels = computed(() =>
    this.fields.filter((f) => this.pending().includes(f.key)).map((f) => f.label),
  );

  protected isPending(key: string): boolean {
    return this.pending().includes(key);
  }

  protected showError(key: string): boolean {
    const control = this.group().get(key);
    return !!control && control.invalid && (control.touched || this.submitted());
  }
}
