import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitationEnterprise } from './solicitation-enterprise';

describe('SolicitationEnterprise', () => {
  let component: SolicitationEnterprise;
  let fixture: ComponentFixture<SolicitationEnterprise>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitationEnterprise],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitationEnterprise);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
