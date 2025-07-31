/* credito.model.ts */
export interface Credito {
  id?: number;
  numeroCredito: string;
  numeroNfse: string;
  dataConstituicao: string;
  valorIssqn: number;
  tipoCredito: string;
  simplesNacional: boolean; 
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

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}