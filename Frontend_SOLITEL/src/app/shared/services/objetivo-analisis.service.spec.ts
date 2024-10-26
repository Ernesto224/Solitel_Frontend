import { TestBed } from '@angular/core/testing';

import { ObjetivoAnalisisService } from './objetivo-analisis.service';

describe('ObjetivoAnalisisService', () => {
  let service: ObjetivoAnalisisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjetivoAnalisisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
