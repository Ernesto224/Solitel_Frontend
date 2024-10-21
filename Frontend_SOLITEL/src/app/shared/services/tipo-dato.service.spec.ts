import { TestBed } from '@angular/core/testing';

import { TipoDatoService } from './tipo-dato.service';

describe('TipoDatoService', () => {
  let service: TipoDatoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoDatoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
