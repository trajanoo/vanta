import { TestBed } from '@angular/core/testing';

import { CriaProjeto } from './cria-projeto';

describe('CriaProjeto', () => {
  let service: CriaProjeto;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CriaProjeto);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
