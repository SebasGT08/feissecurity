import { TestBed } from '@angular/core/testing';

import { EnvioFireService } from './envio-fire.service';

describe('EnvioFireService', () => {
  let service: EnvioFireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnvioFireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
