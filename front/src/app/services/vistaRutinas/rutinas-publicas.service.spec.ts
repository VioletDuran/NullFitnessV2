import { TestBed } from '@angular/core/testing';

import { RutinasPublicasService } from './rutinas-publicas.service';

describe('RutinasPublicasService', () => {
  let service: RutinasPublicasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RutinasPublicasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
