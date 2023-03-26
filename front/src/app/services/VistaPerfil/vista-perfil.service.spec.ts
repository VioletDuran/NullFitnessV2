import { TestBed } from '@angular/core/testing';

import { VistaPerfilService } from './vista-perfil.service';

describe('VistaPerfilService', () => {
  let service: VistaPerfilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VistaPerfilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
