import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudProveedorComponent } from './solicitud-proveedor.component';

describe('SolicitudProveedorComponent', () => {
  let component: SolicitudProveedorComponent;
  let fixture: ComponentFixture<SolicitudProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudProveedorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
