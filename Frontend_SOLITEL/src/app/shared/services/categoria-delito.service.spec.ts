import { TestBed } from '@angular/core/testing';

import { CategoriaDelitoService } from './categoria-delito.service';

describe('CategoriaDelitoService', () => {
  let service: CategoriaDelitoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriaDelitoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
