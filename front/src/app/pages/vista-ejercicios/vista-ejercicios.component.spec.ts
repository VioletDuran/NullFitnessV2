import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaEjerciciosComponent } from './vista-ejercicios.component';

describe('VistaEjerciciosComponent', () => {
  let component: VistaEjerciciosComponent;
  let fixture: ComponentFixture<VistaEjerciciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaEjerciciosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaEjerciciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
