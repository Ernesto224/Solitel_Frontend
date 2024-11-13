import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInformacionComponent } from './modal-informacion.component';

describe('ModalInformacionComponent', () => {
  let component: ModalInformacionComponent;
  let fixture: ComponentFixture<ModalInformacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalInformacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalInformacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
