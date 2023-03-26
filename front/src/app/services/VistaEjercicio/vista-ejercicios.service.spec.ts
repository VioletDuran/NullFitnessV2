import { TestBed } from '@angular/core/testing';

import { VistaEjerciciosService } from './vista-ejercicios.service';

describe('VistaEjerciciosService', () => {
  let service: VistaEjerciciosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VistaEjerciciosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
