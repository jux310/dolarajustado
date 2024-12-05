import { format, parseISO } from 'date-fns';
import { DolarBolsa, UVAData, ChartData } from '../types';
import { fillMissingDates } from './interpolation';

export const formatChartData = (dolarData: DolarBolsa[], uvaData: UVAData[]): ChartData[] => {
  if (!Array.isArray(dolarData) || !Array.isArray(uvaData)) {
    throw new Error('Invalid data format received');
  }

  // Filter out invalid data points
  const validDolarData = dolarData.filter(
    dolar => dolar?.fecha && typeof dolar.venta === 'number' && dolar.venta > 0
  );
  
  const validUvaData = uvaData.filter(
    uva => uva?.fecha && typeof uva.valor === 'number' && uva.valor > 0
  );

  // Process each dataset separately first
  const dolarMap = new Map<string, number>();
  const uvaMap = new Map<string, number>();

  validDolarData.forEach(dolar => {
    try {
      const date = format(parseISO(dolar.fecha), 'yyyy-MM-dd');
      dolarMap.set(date, dolar.venta);
    } catch (error) {
      console.error('Error processing dolar data:', error);
    }
  });

  validUvaData.forEach(uva => {
    try {
      const date = format(parseISO(uva.fecha), 'yyyy-MM-dd');
      uvaMap.set(date, uva.valor);
    } catch (error) {
      console.error('Error processing UVA data:', error);
    }
  });

  // Get all unique dates
  const allDates = new Set([...dolarMap.keys(), ...uvaMap.keys()]);
  const sortedDates = Array.from(allDates).sort();

  // Get the latest UVA value
  const latestUvaValue = validUvaData[validUvaData.length - 1]?.valor || 0;

  // Create initial dataset with existing values
  const initialData: ChartData[] = sortedDates.map(dateStr => {
    const date = parseISO(dateStr);
    const dolarValue = dolarMap.get(dateStr) || 0;
    const uvaValue = uvaMap.get(dateStr) || 0;
    
    // Calculate adjusted dolar value: (dolar_value / uva_value) * latest_uva_value
    const adjustedDolarValue = uvaValue > 0 
      ? (dolarValue / uvaValue) * latestUvaValue
      : 0;

    return {
      date,
      dolarValue,
      uvaValue,
      adjustedDolarValue
    };
  });

  // Fill missing dates and interpolate values
  return fillMissingDates(initialData);
};

export const formatDate = (date: Date): string => {
  try {
    return format(date, 'dd/MM/yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

export const formatCurrency = (value: number): string => {
  try {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return 'Invalid amount';
  }
};

export const formatDateDifference = (startDate: Date, endDate: Date): string => {
  try {
    const diffInDays = Math.abs(Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    
    if (diffInDays < 30) {
      return `${diffInDays} días`;
    }
    
    const months = Math.floor(diffInDays / 30);
    const remainingDays = diffInDays % 30;
    
    if (months < 12) {
      return remainingDays > 0 
        ? `${months} meses y ${remainingDays} días`
        : `${months} meses`;
    }
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (remainingMonths === 0) {
      return years === 1 ? '1 año' : `${years} años`;
    }
    
    return years === 1
      ? `1 año y ${remainingMonths} meses`
      : `${years} años y ${remainingMonths} meses`;
  } catch (error) {
    console.error('Error formatting date difference:', error);
    return 'Invalid date range';
  }
};