import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleSolicitudAnalistaComponent } from './detalle-solicitud-analista.component';

describe('DetalleSolicitudAnalistaComponent', () => {
  let component: DetalleSolicitudAnalistaComponent;
  let fixture: ComponentFixture<DetalleSolicitudAnalistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleSolicitudAnalistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleSolicitudAnalistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
