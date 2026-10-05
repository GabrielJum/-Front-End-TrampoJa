import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Solicitation } from './solicitation';

describe('Solicitation', () => {
  let component: Solicitation;
  let fixture: ComponentFixture<Solicitation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Solicitation],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Solicitation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
