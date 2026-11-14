import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-modal-alert',
  imports: [FontAwesomeModule],
  templateUrl: './modal-alert.html',
  styleUrl: './modal-alert.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalAlert {
  readonly title = input.required<string>();
  readonly message = input('');
  readonly confirmLabel = input('Confirmar');
  readonly cancelLabel = input('Cancelar');

  readonly confirm = output<void>();
  readonly close = output<void>();

  protected readonly warningIcon = faTriangleExclamation;

  protected onConfirm(): void {
    this.confirm.emit();
  }

  protected onClose(): void {
    this.close.emit();
  }
}
