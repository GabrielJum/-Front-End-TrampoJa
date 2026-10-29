import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Enterprise } from './enterprise';

describe('Enterprise', () => {
  let component: Enterprise;
  let fixture: ComponentFixture<Enterprise>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Enterprise],
    }).compileComponents();

    fixture = TestBed.createComponent(Enterprise);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
