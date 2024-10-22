import { TestBed } from '@angular/core/testing';

import { TipoSolicitudService } from './tipo-solicitud.service';

describe('TipoSolicitudService', () => {
  let service: TipoSolicitudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoSolicitudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
