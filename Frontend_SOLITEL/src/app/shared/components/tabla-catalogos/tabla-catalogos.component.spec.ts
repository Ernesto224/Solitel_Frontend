import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaCatalogosComponent } from './tabla-catalogos.component';

describe('TablaCatalogosComponent', () => {
  let component: TablaCatalogosComponent;
  let fixture: ComponentFixture<TablaCatalogosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaCatalogosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaCatalogosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
