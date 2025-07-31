import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { Credito } from '../models/credito.model';
import { Observable, catchError, throwError, map } from 'rxjs';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class CreditoService {
  private http = inject(HttpClient);
  private messageService = inject(MessageService);
  private apiUrl = `${environment.apiUrl}/api/creditos`;

  constructor() { }

  buscarPorNfse(numeroNfse: string): Observable<Credito[]> {
    const url = `${this.apiUrl}/${numeroNfse}`;
    console.log('🔍 Buscando créditos por NFS-e:', numeroNfse, '➡️ URL:', url);

    return this.http.get<Credito[]>(url).pipe(
      map(creditos =>
        creditos.map(credito => ({
          ...credito
          // Remove a conversão se simplesNacional já é boolean
        }))
      ),
      catchError(error => {
        this.handleError('Erro ao buscar por NFS-e', error);
        return throwError(() => error);
      })
    );
  }

  buscarPorNumeroCredito(numeroCredito: string): Observable<Credito> {
    // ✅ Usa diretamente o endpoint detalhado
    const url = `${this.apiUrl}/credito/${numeroCredito}`;
    console.log('🔍 Buscando crédito por número:', numeroCredito, '➡️ URL:', url);

    return this.http.get<Credito>(url).pipe(
      map(credito => ({
        ...credito
        // Remove a conversão se simplesNacional já é boolean
      })),
      catchError(error => {
        console.error('❌ Erro detalhado:', error);
        
        let msg: string;
        
        if (error.status === 404) {
          msg = 'Nenhum crédito encontrado para o número informado.';
        } else if (error.status === 500) {
          msg = 'Erro interno do servidor. Tente novamente.';
        } else if (error.status === 0) {
          msg = 'Não foi possível conectar com o servidor.';
        } else {
          msg = `Erro ${error.status}: ${error.statusText || 'Erro desconhecido'}`;
        }
        
        this.handleError(msg, error);
        return throwError(() => error);
      })
    );
  }

  private handleError(message: string, error: any): void {
    console.error('🚨 Erro no serviço:', message, error);
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: message,
      life: 5000
    });
  }
}