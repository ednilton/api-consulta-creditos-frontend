import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { CreditoService } from './credito.service';
import { Credito } from '../models/credito.model';
import { environment } from '../../../environments/environment';

describe('CreditoService', () => {
  let service: CreditoService;
  let httpMock: HttpTestingController;
  let messageService: jasmine.SpyObj<MessageService>;

  const mockCredito: Credito = {
    numeroCredito: '123456',
    numeroNfse: '7891011',
    dataConstituicao: '2024-02-25',
    valorIssqn: 1500.75,
    tipoCredito: 'ISSQN',
    simplesNacional: true,
    aliquota: 5.0,
    baseCalculo: 25000.00,
    valorFaturado: 30000.00,
    valorDeducao: 5000.00
  };

  const mockCreditosList: Credito[] = [
    mockCredito,
    {
      numeroCredito: '789012',
      numeroNfse: '7891011',
      dataConstituicao: '2024-02-24',
      valorIssqn: 1200.50,
      tipoCredito: 'ISSQN',
      simplesNacional: false,
      aliquota: 4.5,
      baseCalculo: 22000.00,
      valorFaturado: 25000.00,
      valorDeducao: 3000.00
    }
  ];

  beforeEach(() => {
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    TestBed.configureTestingModule({
      providers: [
        CreditoService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });

    service = TestBed.inject(CreditoService);
    httpMock = TestBed.inject(HttpTestingController);
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Configuração do Service', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('deve construir URL correta da API', () => {
      // Verificamos se a URL base está sendo construída corretamente
      expect(service['apiUrl']).toBe(`${environment.apiUrl}/api/creditos`);
    });
  });

  describe('buscarPorNfse()', () => {
    it('deve buscar créditos por NFS-e com sucesso', () => {
      const numeroNfse = '7891011';

      service.buscarPorNfse(numeroNfse).subscribe({
        next: (creditos) => {
          expect(creditos).toEqual(mockCreditosList);
          expect(creditos.length).toBe(2);
          expect(creditos[0].numeroNfse).toBe(numeroNfse);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/creditos/${numeroNfse}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCreditosList);
    });

    it('deve tratar erro 404 - NFS-e não encontrada', () => {
      const numeroNfse = '999999';

      service.buscarPorNfse(numeroNfse).subscribe({
        next: () => fail('Deveria ter falhado com 404'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(messageService.add).toHaveBeenCalledWith({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar por NFS-e',
            life: 5000
          });
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/creditos/${numeroNfse}`);
      req.flush('NFS-e não encontrada', { status: 404, statusText: 'Not Found' });
    });

    it('deve tratar erro 500 - Erro interno do servidor', () => {
      const numeroNfse = '7891011';

      service.buscarPorNfse(numeroNfse).subscribe({
        next: () => fail('Deveria ter falhado com 500'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(messageService.add).toHaveBeenCalled();
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/creditos/${numeroNfse}`);
      req.flush('Erro interno', { status: 500, statusText: 'Internal Server Error' });
    });

    it('deve retornar array vazio quando não há créditos', () => {
      const numeroNfse = '1111111';

      service.buscarPorNfse(numeroNfse).subscribe({
        next: (creditos) => {
          expect(creditos).toEqual([]);
          expect(creditos.length).toBe(0);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/creditos/${numeroNfse}`);
      req.flush([]);
    });
  });

  describe('buscarPorNumeroCredito()', () => {
    it('deve buscar crédito por número com sucesso', () => {
      const numeroCredito = '123456';

      service.buscarPorNumeroCredito(numeroCredito).subscribe({
        next: (credito) => {
          expect(credito).toEqual(mockCredito);
          expect(credito.numeroCredito).toBe(numeroCredito);
          expect(credito.valorIssqn).toBe(1500.75);
          expect(credito.simplesNacional).toBe(true);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/creditos/credito/${numeroCredito}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCredito);
    });

    it('deve tratar erro 404 - Crédito não encontrado', () => {
      const numeroCredito = '999999';

      service.buscarPorNumeroCredito(numeroCredito).subscribe({
        next: () => fail('Deveria ter falhado com 404'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(messageService.add).toHaveBeenCalledWith({
            severity: 'error',
            summary: 'Erro',
            detail: 'Nenhum crédito encontrado para o número informado.',
            life: 5000
          });
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/creditos/credito/${numeroCredito}`);
      req.flush('Crédito não encontrado', { status: 404, statusText: 'Not Found' });
    });

    it('deve tratar erro 500 - Erro interno do servidor', () => {
      const numeroCredito = '123456';

      service.buscarPorNumeroCredito(numeroCredito).subscribe({
        next: () => fail('Deveria ter falhado com 500'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(messageService.add).toHaveBeenCalledWith({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro interno do servidor. Tente novamente.',
            life: 5000
          });
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/creditos/credito/${numeroCredito}`);
      req.flush('Erro interno', { status: 500, statusText: 'Internal Server Error' });
    });

    it('deve tratar erro de conexão (status 0)', () => {
      const numeroCredito = '123456';

      service.buscarPorNumeroCredito(numeroCredito).subscribe({
        next: () => fail('Deveria ter falhado com erro de conexão'),
        error: (error) => {
          expect(error.status).toBe(0);
          expect(messageService.add).toHaveBeenCalledWith({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível conectar com o servidor.',
            life: 5000
          });
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/creditos/credito/${numeroCredito}`);
      req.error(new ProgressEvent('Network error'), { status: 0, statusText: 'Unknown Error' });
    });

    it('deve tratar erro genérico com status desconhecido', () => {
      const numeroCredito = '123456';

      service.buscarPorNumeroCredito(numeroCredito).subscribe({
        next: () => fail('Deveria ter falhado com erro genérico'),
        error: (error) => {
          expect(error.status).toBe(403);
          expect(messageService.add).toHaveBeenCalledWith({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro 403: Forbidden',
            life: 5000
          });
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/creditos/credito/${numeroCredito}`);
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
    });
  });

  describe('Data Mapping', () => {
    it('deve manter dados do crédito inalterados após mapping', () => {
      const numeroCredito = '123456';

      service.buscarPorNumeroCredito(numeroCredito).subscribe({
        next: (credito) => {
          // Verifica se todos os campos foram preservados
          expect(credito.numeroCredito).toBe(mockCredito.numeroCredito);
          expect(credito.numeroNfse).toBe(mockCredito.numeroNfse);
          expect(credito.dataConstituicao).toBe(mockCredito.dataConstituicao);
          expect(credito.valorIssqn).toBe(mockCredito.valorIssqn);
          expect(credito.tipoCredito).toBe(mockCredito.tipoCredito);
          expect(credito.simplesNacional).toBe(mockCredito.simplesNacional);
          expect(credito.aliquota).toBe(mockCredito.aliquota);
          expect(credito.baseCalculo).toBe(mockCredito.baseCalculo);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/creditos/credito/${numeroCredito}`);
      req.flush(mockCredito);
    });

    it('deve preservar tipos de dados corretos', () => {
      const numeroNfse = '7891011';

      service.buscarPorNfse(numeroNfse).subscribe({
        next: (creditos) => {
          const credito = creditos[0];
          expect(typeof credito.numeroCredito).toBe('string');
          expect(typeof credito.valorIssqn).toBe('number');
          expect(typeof credito.simplesNacional).toBe('boolean');
          expect(typeof credito.aliquota).toBe('number');
          expect(typeof credito.baseCalculo).toBe('number');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/creditos/${numeroNfse}`);
      req.flush(mockCreditosList);
    });
  });

  describe('URL Construction', () => {
    it('deve construir URL correta para busca por NFS-e', () => {
      const numeroNfse = '7891011';
      
      service.buscarPorNfse(numeroNfse).subscribe();
      
      const expectedUrl = `${environment.apiUrl}/api/creditos/${numeroNfse}`;
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.url).toBe(expectedUrl);
      req.flush([]);
    });

    it('deve construir URL correta para busca por número do crédito', () => {
      const numeroCredito = '123456';
      
      service.buscarPorNumeroCredito(numeroCredito).subscribe();
      
      const expectedUrl = `${environment.apiUrl}/api/creditos/credito/${numeroCredito}`;
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.url).toBe(expectedUrl);
      req.flush(mockCredito);
    });

    it('deve lidar com caracteres especiais na URL', () => {
      const numeroComEspeciais = '123/456';
      
      service.buscarPorNumeroCredito(numeroComEspeciais).subscribe();
      
      const req = httpMock.expectOne(`${environment.apiUrl}/api/creditos/credito/${numeroComEspeciais}`);
      expect(req.request.url).toContain(numeroComEspeciais);
      req.flush(mockCredito);
    });
  });
});