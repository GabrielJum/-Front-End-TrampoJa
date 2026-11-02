import { TestBed } from '@angular/core/testing';
import { EnterpriseService } from './enterprise';

describe('Enterprise', () => {
  let service: EnterpriseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnterpriseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
