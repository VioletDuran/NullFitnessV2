import { TestBed } from '@angular/core/testing';

import { ServicioEjerciciosRutService } from './servicio-ejercicios-rut.service';

describe('ServicioEjerciciosRutService', () => {
  let service: ServicioEjerciciosRutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioEjerciciosRutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
