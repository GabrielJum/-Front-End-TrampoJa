import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowUpRightFromSquare, faLocationDot } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-address',
  imports: [FontAwesomeModule],
  templateUrl: './address.html',
  styleUrl: './address.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Address {
  readonly address = input.required<string>();
  readonly label = input('Localização');

  protected readonly mapUrl = computed(
    () => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.address())}`,
  );

  protected readonly icons = {
    location: faLocationDot,
    external: faArrowUpRightFromSquare,
  };
}
