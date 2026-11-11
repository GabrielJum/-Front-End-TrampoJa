import { TestBed } from '@angular/core/testing';
import { Freelancer } from './freelancer';

describe('Freelancer', () => {
  let service: Freelancer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Freelancer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
