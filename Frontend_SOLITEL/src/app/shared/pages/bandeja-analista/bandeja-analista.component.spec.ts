import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaAnalistaComponent } from './bandeja-analista.component';

describe('BandejaAnalistaComponent', () => {
  let component: BandejaAnalistaComponent;
  let fixture: ComponentFixture<BandejaAnalistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BandejaAnalistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BandejaAnalistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
