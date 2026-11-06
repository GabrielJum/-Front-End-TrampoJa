import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition, faCheck, faHourglassHalf, faXmark } from '@fortawesome/free-solid-svg-icons';

export type VacancyStatus = 'confirmed' | 'review' | 'canceled';

export interface VacancyStep {
  label: string;
  done: boolean;
}

const STATUS_ICONS: Record<VacancyStatus, IconDefinition> = {
  confirmed: faCheck,
  review: faHourglassHalf,
  canceled: faXmark,
};

@Component({
  selector: 'app-status-vacancy',
  imports: [FontAwesomeModule],
  templateUrl: './status-vacancy.html',
  styleUrl: './status-vacancy.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusVacancy {
  readonly status = input.required<VacancyStatus>();
  readonly label = input.required<string>();
  readonly message = input.required<string>();
  readonly steps = input.required<VacancyStep[]>();

  protected readonly icon = computed(() => STATUS_ICONS[this.status()]);
  protected readonly checkIcon = faCheck;
}
