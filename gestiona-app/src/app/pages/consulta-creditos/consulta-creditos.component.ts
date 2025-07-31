import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { BreadcrumbModule } from 'primeng/breadcrumb';

import { CreditoService } from '../../services/credito.service';
import { Credito, TipoConsulta } from '../../models/credito.model';

@Component({
  selector: 'app-consulta-creditos',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './consulta-creditos.component.html',
  styleUrls: ['./consulta-creditos.component.scss'],
  providers: [MessageService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    RadioButtonModule,
    TableModule,
    TagModule,
    ToastModule,
    ProgressSpinnerModule,
    MessageModule,
    PanelModule,
    BreadcrumbModule
  ],
})
export class ConsultaCreditosComponent implements OnInit {
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private creditoService = inject(CreditoService);
  private cdr = inject(ChangeDetectorRef); // ✅ Para forçar detecção de mudanças

  form!: FormGroup;
  creditos: Credito[] = [];
  creditoSelecionado: Credito | null = null;
  carregando = false;

  breadcrumbItems = [
    { label: 'Home', url: '/' },
    { label: 'Consulta de Créditos' }
  ];

  tiposConsulta: TipoConsulta[] = [
    {
      label: 'Número da NFS-e',
      value: 'nfse',
      description: 'Buscar por número da Nota Fiscal de Serviços',
      placeholder: 'Ex: 7891011',
      icon: 'pi pi-file-o',
    },
    {
      label: 'Número do Crédito',
      value: 'credito',
      description: 'Buscar por número do crédito constituído',
      placeholder: 'Ex: 123456',
      icon: 'pi pi-credit-card',
    },
  ];

  colunas = [
    { field: 'numeroCredito', header: 'Nº Crédito', width: '120px' },
    { field: 'numeroNfse', header: 'Nº NFS-e', width: '120px' },
    { field: 'dataConstituicao', header: 'Data Constituição', width: '140px' },
    { field: 'valorIssqn', header: 'Valor ISSQN', width: '130px' },
    { field: 'tipoCredito', header: 'Tipo', width: '100px' },
    { field: 'simplesNacional', header: 'Simples Nacional', width: '140px' },
    { field: 'aliquota', header: 'Alíquota', width: '100px' },
    { field: 'baseCalculo', header: 'Base Cálculo', width: '130px' },
  ];

  ngOnInit(): void {
    this.form = this.fb.group({
      tipoConsulta: ['nfse'],
      valorBusca: ['', Validators.required],
    });
  }

  get tipoConsultaAtual(): TipoConsulta {
    return this.tiposConsulta.find(
      tipo => tipo.value === this.form.value.tipoConsulta
    ) ?? this.tiposConsulta[0];
  }

  consultarCreditos(): void {
    const valor = this.form.value.valorBusca?.trim();
    if (!valor) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Por favor, informe um valor para consulta',
      });
      return;
    }

    console.log('🚀 Iniciando consulta:', valor);
    
    this.carregando = true;
    this.creditos = [];
    this.creditoSelecionado = null;
    this.cdr.detectChanges(); // ✅ Força atualização da tela

    this.bloquearCampoBusca();
    this.messageService.clear();

    const tipo = this.form.value.tipoConsulta;
    
    if (tipo === 'nfse') {
      this.consultarPorNfse(valor);
    } else {
      this.consultarPorCredito(valor);
    }
  }

  consultarPorNfse(valor: string): void {
    console.log('🔍 Consultando por NFS-e:', valor);

    this.creditoService.buscarPorNfse(valor).subscribe({
      next: (creditos) => {
        console.log('✅ Resposta recebida:', creditos);
        this.creditos = creditos;
        this.creditoSelecionado = null; // ✅ Limpa detalhes ao mostrar tabela
        this.carregando = false;
        this.desbloquearCampoBusca();
        this.cdr.detectChanges();
        
        if (creditos.length === 0) {
          this.messageService.add({
            severity: 'info',
            summary: 'Nenhum resultado encontrado',
            detail: `Nenhum crédito encontrado para a NFS-e: ${valor}`,
          });
        } else {
          this.messageService.add({
            severity: 'success',
            summary: 'Consulta realizada',
            detail: `${creditos.length} crédito(s) encontrado(s) para NFS-e: ${valor}`,
          });
        }
      },
      error: (error) => {
        console.error('❌ Erro na consulta:', error);
        this.carregando = false;
        this.desbloquearCampoBusca();
        this.cdr.detectChanges();
        
        this.messageService.add({
          severity: 'error',
          summary: 'Erro na consulta',
          detail: 'Não foi possível consultar os créditos. Tente novamente.',
        });
      }
    });
  }

  consultarPorCredito(valor: string): void {
    console.log('🔍 Consultando por número do crédito:', valor);

    this.creditoService.buscarPorNumeroCredito(valor).subscribe({
      next: (credito) => {
        console.log('✅ Crédito encontrado:', credito);
        this.creditoSelecionado = credito;
        this.creditos = []; // ✅ Limpa tabela ao mostrar detalhes
        this.carregando = false;
        this.desbloquearCampoBusca();
        this.cdr.detectChanges();
        
        this.messageService.add({
          severity: 'success',
          summary: 'Crédito encontrado',
          detail: `Crédito nº ${credito.numeroCredito} localizado`,
        });
      },
      error: (error) => {
        console.error('❌ Erro na consulta:', error);
        this.carregando = false;
        this.desbloquearCampoBusca();
        this.cdr.detectChanges();
        
        const msg = error.status === 404 
          ? `Crédito ${valor} não encontrado`
          : 'Erro ao consultar crédito. Tente novamente.';
          
        this.messageService.add({
          severity: 'info',
          summary: 'Crédito não encontrado',
          detail: msg,
        });
      }
    });
  }

  limparConsulta(): void {
    this.form.reset({ tipoConsulta: 'nfse', valorBusca: '' });
    this.creditos = [];
    this.creditoSelecionado = null;
    this.messageService.clear();
    this.cdr.detectChanges(); // ✅ Força atualização da tela
  }

  formatarMoeda(valor: number): string {
    if (valor == null) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  }

  formatarData(data: string): string {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
  }

  formatarPercentual(valor: number): string {
    if (valor == null) return '0%';
    return `${valor.toFixed(1)}%`;
  }

  getSeveridadeTipoCredito(tipo: string): string {
    return tipo === 'ISSQN' ? 'success' : 'info';
  }

  getSeveridadeSimplesNacional(valor: boolean): string {
    return valor ? 'success' : 'warn';
  }

  private bloquearCampoBusca(): void {
    this.form.get('valorBusca')?.disable({ emitEvent: false });
  }

  private desbloquearCampoBusca(): void {
    this.form.get('valorBusca')?.enable({ emitEvent: false });
  }
}