import { TestBed } from '@angular/core/testing';

import { TipoAnalisisService } from './tipo-analisis.service';

describe('TipoAnalisisService', () => {
  let service: TipoAnalisisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoAnalisisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
