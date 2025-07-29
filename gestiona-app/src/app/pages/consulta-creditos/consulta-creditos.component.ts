import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

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

export interface Credito {
  numeroCredito: string;
  numeroNfse: string;
  dataConstituicao: string;
  valorIssqn: number;
  tipoCredito: string;
  simplesNacional: string;
  aliquota: number;
  valorFaturado: number;
  valorDeducao: number;
  baseCalculo: number;
}

export interface TipoConsulta {
  label: string;
  value: 'nfse' | 'credito';
  description: string;
  placeholder: string;
  icon: string;
}

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

  creditosMock: Credito[] = [
    {
      numeroCredito: '123456',
      numeroNfse: '7891011',
      dataConstituicao: '2023-06-15',
      valorIssqn: 1200.5,
      tipoCredito: 'ISSQN',
      simplesNacional: 'Sim',
      aliquota: 5,
      valorFaturado: 24000,
      valorDeducao: 1000,
      baseCalculo: 23000
    }
  ];

  ngOnInit(): void {
    this.form = this.fb.group({
      tipoConsulta: ['nfse'],
      valorBusca: [''],
    });
  }

  get tipoConsultaAtual(): TipoConsulta {
    return this.tiposConsulta.find(
      (tipo) => tipo.value === this.form.value.tipoConsulta
    )!;
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

    this.carregando = true;
    this.creditos = [];
    this.creditoSelecionado = null;
    this.form.get('valorBusca')?.disable();
    this.messageService.clear();

    setTimeout(() => {
      try {
        const tipo = this.form.value.tipoConsulta;
        tipo === 'nfse'
          ? this.consultarPorNfse(valor)
          : this.consultarPorCredito(valor);
      } catch {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao consultar créditos.',
        });
      } finally {
        this.carregando = false;
        this.form.get('valorBusca')?.enable();
      }
    }, 1500);
  }

  consultarPorNfse(valor: string): void {
    const resultados = this.creditosMock.filter(
      (c) => c.numeroNfse === valor
    );
    resultados.length
      ? (this.creditos = resultados)
      : this.messageService.add({
          severity: 'info',
          summary: 'Nenhum resultado encontrado',
          detail: `Nenhum crédito encontrado para a NFS-e: ${valor}`,
        });
  }

  consultarPorCredito(valor: string): void {
    const resultado = this.creditosMock.find(
      (c) => c.numeroCredito === valor
    );
    resultado
      ? (this.creditoSelecionado = resultado)
      : this.messageService.add({
          severity: 'info',
          summary: 'Crédito não encontrado',
          detail: `Número informado: ${valor}`,
        });
  }

  limparConsulta(): void {
    this.form.reset({ tipoConsulta: 'nfse', valorBusca: '' });
    this.creditos = [];
    this.creditoSelecionado = null;
    this.messageService.clear();
  }

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  formatarPercentual(valor: number): string {
    return `${valor.toFixed(1)}%`;
  }

  getSeveridadeTipoCredito(tipo: string) {
    return tipo === 'ISSQN' ? 'success' : 'info';
  }

  getSeveridadeSimplesNacional(valor: string) {
    return valor === 'Sim' ? 'success' : 'warn';
  }
}
