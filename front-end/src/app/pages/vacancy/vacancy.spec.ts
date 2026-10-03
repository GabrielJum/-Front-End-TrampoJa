import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Vacancy } from './vacancy';

describe('Vacancy', () => {
  let fixture: ComponentFixture<Vacancy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vacancy],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Vacancy);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render job cards', () => {
    const cards = (fixture.nativeElement as HTMLElement).querySelectorAll('.job');
    expect(cards.length).toBeGreaterThan(0);
  });
});
