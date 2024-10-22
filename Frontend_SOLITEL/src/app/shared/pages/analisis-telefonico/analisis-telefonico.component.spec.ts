import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalisisTelefonicoComponent } from './analisis-telefonico.component';

describe('AnalisisTelefonicoComponent', () => {
  let component: AnalisisTelefonicoComponent;
  let fixture: ComponentFixture<AnalisisTelefonicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalisisTelefonicoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalisisTelefonicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
