import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProcesandoComponent } from './modal-procesando.component';

describe('ModalProcesandoComponent', () => {
  let component: ModalProcesandoComponent;
  let fixture: ComponentFixture<ModalProcesandoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalProcesandoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalProcesandoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
