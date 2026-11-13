import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VacancyManage } from './vacancy-manage';

describe('VacancyManage', () => {
  let component: VacancyManage;
  let fixture: ComponentFixture<VacancyManage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacancyManage],
    }).compileComponents();

    fixture = TestBed.createComponent(VacancyManage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
