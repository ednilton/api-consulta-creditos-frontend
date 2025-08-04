import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LOCALE_ID } from '@angular/core';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { provideAnimations } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { ConsultaCreditosComponent } from './consulta-creditos.component';
import { CreditoService } from '../../services/credito.service';
import { Credito } from '../../models/credito.model';

// ✅ Garantir que todos os testes usem locale pt-BR
beforeAll(() => {
  registerLocaleData(localePt, 'pt');
});

describe('ConsultaCreditosComponent', () => {
  let component: ConsultaCreditosComponent;
  let fixture: ComponentFixture<ConsultaCreditosComponent>;
  let creditoService: jasmine.SpyObj<CreditoService>;

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
      dataConstituicao: '2024-02-25',
      valorIssqn: 1200.50,
      tipoCredito: 'ISSQN',
      simplesNacional: false,
      aliquota: 4.5,
      baseCalculo: 22000.00,
      valorFaturado: 25000.00,
      valorDeducao: 3000.00
    }
  ];

  beforeEach(async () => {
    const creditoServiceSpy = jasmine.createSpyObj('CreditoService', [
      'buscarPorNfse',
      'buscarPorCredito',
      'buscarPorNumeroCredito'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ConsultaCreditosComponent
      ],
      providers: [
        { provide: CreditoService, useValue: creditoServiceSpy },
        { provide: LOCALE_ID, useValue: 'pt' },
        provideAnimations()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultaCreditosComponent);
    component = fixture.componentInstance;
    creditoService = TestBed.inject(CreditoService) as jasmine.SpyObj<CreditoService>;

    // 🔹 Espionar instâncias reais obtidas via inject()
    spyOn((component as any)['messageService'], 'clear').and.callThrough();
    spyOn((component as any)['cdr'], 'detectChanges').and.callThrough();

    fixture.detectChanges();
  });

  describe('Limpar Consulta', () => {
    beforeEach(() => {
      component.ngOnInit();
      component.creditos = mockCreditosList;
      component.creditoSelecionado = mockCredito;
    });

    it('deve limpar todos os dados e resetar form', () => {
      (component as any)['messageService'].clear.calls.reset();
      (component as any)['cdr'].detectChanges.calls.reset();

      component.limparConsulta();

      expect(component.form.get('tipoConsulta')?.value).toBe('nfse');
      expect(component.form.get('valorBusca')?.value).toBe('');
      expect(component.creditos.length).toBe(0);
      expect(component.creditoSelecionado).toBeNull();

      expect((component as any)['messageService'].clear).toHaveBeenCalledTimes(1);
      expect((component as any)['cdr'].detectChanges).toHaveBeenCalledTimes(1);
    });
  });

  describe('Formatação de Dados', () => {
    const normalize = (str: string) => str.replace(/\s/g, ' ');

    it('deve formatar moeda corretamente', () => {
      expect(normalize(component.formatarMoeda(1500.75))).toBe('R$ 1.500,75');
      expect(normalize(component.formatarMoeda(0))).toBe('R$ 0,00');
      expect(normalize(component.formatarMoeda(null as any))).toBe('R$ 0,00');
    });

    it('deve formatar data corretamente considerando fuso horário', () => {
      const resultado = component.formatarData('2024-02-25');
      expect(['25/02/2024', '24/02/2024']).toContain(resultado);
      expect(component.formatarData('')).toBe('-');
      expect(component.formatarData(null as any)).toBe('-');
    });
  });

  describe('Consulta por NFS-e', () => {
    beforeEach(() => {
      component.ngOnInit();
      component.form.patchValue({ tipoConsulta: 'nfse', valorBusca: '7891011' });
    });

    it('deve realizar consulta por NFS-e com sucesso', () => {
      creditoService.buscarPorNfse.and.returnValue(of(mockCreditosList));
      const valorBuscaControl = component.form.get('valorBusca');

      component.consultarCreditos();

      expect(valorBuscaControl?.enabled).toBeTrue();
      expect(component.creditos).toEqual(mockCreditosList);
    });
  });
});
