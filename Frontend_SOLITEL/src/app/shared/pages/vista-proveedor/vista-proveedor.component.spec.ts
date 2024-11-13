import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaProveedorComponent } from './vista-proveedor.component';

describe('VistaProveedorComponent', () => {
  let component: VistaProveedorComponent;
  let fixture: ComponentFixture<VistaProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaProveedorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
