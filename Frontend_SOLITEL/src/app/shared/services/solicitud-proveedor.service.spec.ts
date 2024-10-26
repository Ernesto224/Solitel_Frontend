import { TestBed } from '@angular/core/testing';

import { SolicitudProveedorService } from './solicitud-proveedor.service';

describe('SolicitudProveedorService', () => {
  let service: SolicitudProveedorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudProveedorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
