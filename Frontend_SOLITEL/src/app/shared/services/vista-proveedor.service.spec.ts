import { TestBed } from '@angular/core/testing';

import { VistaProveedorService } from './vista-proveedor.service';

describe('VistaProveedorService', () => {
  let service: VistaProveedorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VistaProveedorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
