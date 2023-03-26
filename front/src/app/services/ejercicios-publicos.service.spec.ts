import { TestBed } from '@angular/core/testing';

import { EjerciciosPublicosService } from './ejercicios-publicos.service';

describe('EjerciciosPublicosService', () => {
  let service: EjerciciosPublicosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EjerciciosPublicosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
