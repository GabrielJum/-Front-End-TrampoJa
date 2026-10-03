import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dados } from './dados';

describe('Dados', () => {
  let component: Dados;
  let fixture: ComponentFixture<Dados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dados],
    }).compileComponents();

    fixture = TestBed.createComponent(Dados);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
