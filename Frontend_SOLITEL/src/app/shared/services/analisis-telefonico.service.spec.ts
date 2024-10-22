import { TestBed } from '@angular/core/testing';

import { AnalisisTelefonicoService } from './analisis-telefonico.service';

describe('AnalisisTelefonicoService', () => {
  let service: AnalisisTelefonicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalisisTelefonicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
