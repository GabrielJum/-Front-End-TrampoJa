import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Candidato } from './candidato';

describe('Candidato', () => {
  let component: Candidato;
  let fixture: ComponentFixture<Candidato>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Candidato],
    }).compileComponents();

    fixture = TestBed.createComponent(Candidato);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
