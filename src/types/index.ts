export interface DolarBolsa {
  casa: string;
  compra: number;
  venta: number;
  fecha: string;
}

export interface UVAData {
  fecha: string;
  valor: number;
}

export interface ChartData {
  date: Date;
  dolarValue: number;
  uvaValue: number;
  adjustedDolarValue: number;
}

// The API returns an array directly, not wrapped in a data property
export type ApiResponse<T> = T[];

export interface HistoricalEvent {
  date: Date;
  description: string;
}