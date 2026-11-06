import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusVacancy } from './status-vacancy';

describe('StatusVacancy', () => {
  let component: StatusVacancy;
  let fixture: ComponentFixture<StatusVacancy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusVacancy],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusVacancy);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('status', 'review');
    fixture.componentRef.setInput('label', 'Em análise');
    fixture.componentRef.setInput('message', 'Aguardando decisão.');
    fixture.componentRef.setInput('steps', [{ label: 'Enviada', done: true }]);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
