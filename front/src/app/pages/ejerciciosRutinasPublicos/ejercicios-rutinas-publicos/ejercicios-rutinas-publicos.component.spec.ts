import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjerciciosRutinasPublicosComponent } from './ejercicios-rutinas-publicos.component';

describe('EjerciciosRutinasPublicosComponent', () => {
  let component: EjerciciosRutinasPublicosComponent;
  let fixture: ComponentFixture<EjerciciosRutinasPublicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EjerciciosRutinasPublicosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EjerciciosRutinasPublicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
