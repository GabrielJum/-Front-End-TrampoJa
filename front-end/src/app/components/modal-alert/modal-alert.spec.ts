import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalAlert } from './modal-alert';

describe('ModalAlert', () => {
  let component: ModalAlert;
  let fixture: ComponentFixture<ModalAlert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAlert],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalAlert);
    fixture.componentRef.setInput('title', 'Excluir vaga?');
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
