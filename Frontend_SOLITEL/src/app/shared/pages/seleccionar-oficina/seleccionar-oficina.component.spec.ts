import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarOficinaComponent } from './seleccionar-oficina.component';

describe('SeleccionarOficinaComponent', () => {
  let component: SeleccionarOficinaComponent;
  let fixture: ComponentFixture<SeleccionarOficinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeleccionarOficinaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeleccionarOficinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
