import { TestBed } from '@angular/core/testing';

import { BusquedaServiceService } from './busqueda-service.service';

describe('BusquedaServiceService', () => {
  let service: BusquedaServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusquedaServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
