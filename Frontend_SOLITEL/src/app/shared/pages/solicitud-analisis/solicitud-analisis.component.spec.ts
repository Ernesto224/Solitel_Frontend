import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudAnalisisComponent } from './solicitud-analisis.component';

describe('SolicitudAnalisisComponent', () => {
  let component: SolicitudAnalisisComponent;
  let fixture: ComponentFixture<SolicitudAnalisisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudAnalisisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudAnalisisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
