import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaVisualizacionComponent } from './tabla-visualizacion.component';

describe('TablaVisualizacionComponent', () => {
  let component: TablaVisualizacionComponent;
  let fixture: ComponentFixture<TablaVisualizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaVisualizacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaVisualizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
