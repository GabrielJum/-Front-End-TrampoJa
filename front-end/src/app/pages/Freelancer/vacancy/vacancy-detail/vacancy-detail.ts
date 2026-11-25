import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Header } from '../../../../components/header/header';
import { NavigationTabs } from '../../../../components/navigation-tabs/navigation-tabs';
import { Address } from '../../../../components/address/address';
import { Footer } from '../../../../components/footer/footer';
import { VacancyService } from '../../../../service/vacancy/vacancy';
import { VacancyType } from '../../../../model/vacancy';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faCalendarDays,
  faCheck,
  faClock,
  faLocationDot,
  faMagnifyingGlass,
  faShieldHalved,
  faStar,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-vacancy-detail',
  imports: [RouterLink, Header, NavigationTabs, Footer, Address, FontAwesomeModule],
  templateUrl: './vacancy-detail.html',
  styleUrl: './vacancy-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VacancyDetail implements OnInit {
  protected readonly icons = {
    back: faArrowLeft,
    calendar: faCalendarDays,
    clock: faClock,
    location: faLocationDot,
    check: faCheck,
    shield: faShieldHalved,
    search: faMagnifyingGlass,
    star: faStar,
  };

  private readonly route = inject(ActivatedRoute);
  private readonly vacancyService = inject(VacancyService);

  protected readonly stars = [1, 2, 3, 4, 5];
  protected readonly rating = 5; // a API ainda não retorna avaliação
  protected readonly job = signal<VacancyType | null>(null);
  protected readonly applied = signal(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.vacancyService.buscarVaga(id).subscribe({
      next: (vaga) => this.job.set(vaga),
      error: () => this.job.set(null),
    });
  }

  protected apply(): void {
    this.applied.set(true);
  }
}
