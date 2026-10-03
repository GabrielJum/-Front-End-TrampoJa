import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Solicitacoes } from './solicitacoes';

describe('Solicitacoes', () => {
  let component: Solicitacoes;
  let fixture: ComponentFixture<Solicitacoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Solicitacoes],
    }).compileComponents();

    fixture = TestBed.createComponent(Solicitacoes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
