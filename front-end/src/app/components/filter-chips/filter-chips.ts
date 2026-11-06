import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface FilterOption<T extends string = string> {
  id: T;
  label: string;
  count: number;
}

@Component({
  selector: 'app-filter-chips',
  templateUrl: './filter-chips.html',
  styleUrl: './filter-chips.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterChips<T extends string = string> {
  readonly options = input.required<FilterOption<T>[]>();
  readonly value = input.required<T>();
  readonly label = input('Filtrar');

  readonly valueChange = output<T>();
}
