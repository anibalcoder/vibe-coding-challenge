export interface Indicator {
  codigo: string;
  nombre: string;
  unidad_medida: string;
  fecha: string;
  valor: number;
}

export interface IndicatorDetail {
  codigo: string;
  nombre: string;
  unidad_medida: string;
  serie: IndicatorSeries[];
}

export interface IndicatorSeries {
  fecha: string;
  valor: number;
}

export type IndicatorCode = 
  | 'uf' 
  | 'ivp' 
  | 'dolar' 
  | 'dolar_intercambio' 
  | 'euro' 
  | 'ipc' 
  | 'utm' 
  | 'imacec' 
  | 'tpm' 
  | 'libra_cobre' 
  | 'tasa_desempleo' 
  | 'bitcoin'; 