import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Address } from './address';

describe('Address', () => {
  let component: Address;
  let fixture: ComponentFixture<Address>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Address],
    }).compileComponents();

    fixture = TestBed.createComponent(Address);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('address', 'Av. Brasil, 1020 - Centro - Suzano/SP');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
