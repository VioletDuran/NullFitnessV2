import { TestBed } from '@angular/core/testing';

import { EjercicioPrivadoService } from './ejercicio-privado.service';

describe('EjercicioPrivadoService', () => {
  let service: EjercicioPrivadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EjercicioPrivadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
