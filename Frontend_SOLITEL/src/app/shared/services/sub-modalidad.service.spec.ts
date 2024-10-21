import { TestBed } from '@angular/core/testing';

import { SubModalidadService } from './sub-modalidad.service';

describe('SubModalidadService', () => {
  let service: SubModalidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubModalidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
