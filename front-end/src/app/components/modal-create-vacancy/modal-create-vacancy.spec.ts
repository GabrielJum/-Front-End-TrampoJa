import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalCreateVacancy } from './modal-create-vacancy';

describe('ModalCreateVacancy', () => {
  let component: ModalCreateVacancy;
  let fixture: ComponentFixture<ModalCreateVacancy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCreateVacancy],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalCreateVacancy);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
