import { TestBed } from '@angular/core/testing';

import { FiscaliaService } from './fiscalia.service';

describe('FiscaliaService', () => {
  let service: FiscaliaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FiscaliaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
