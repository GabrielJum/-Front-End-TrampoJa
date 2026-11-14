import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleCheck, faCircleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';
import { TooltipService } from '../../service/tooltip/tooltip';

@Component({
  selector: 'app-tooltip',
  imports: [FontAwesomeModule],
  templateUrl: './tooltip.html',
  styleUrl: './tooltip.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tooltip {
  protected readonly tooltip = inject(TooltipService);

  protected readonly icons = {
    success: faCircleCheck,
    error: faCircleExclamation,
    close: faXmark,
  };
}
