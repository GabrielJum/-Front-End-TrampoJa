import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SolicitationFreelancer } from './solicitation-freelancer';

describe('SolicitationFreelancer', () => {
  let component: SolicitationFreelancer;
  let fixture: ComponentFixture<SolicitationFreelancer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitationFreelancer],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitationFreelancer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
