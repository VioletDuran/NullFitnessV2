import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaRutinasComponent } from './vista-rutinas.component';

describe('VistaRutinasComponent', () => {
  let component: VistaRutinasComponent;
  let fixture: ComponentFixture<VistaRutinasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaRutinasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaRutinasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
