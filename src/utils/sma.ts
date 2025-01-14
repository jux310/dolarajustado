import { ChartData } from '../types';

export const calculateSMA = (data: ChartData[], period: number): (number | null)[] => {
  const smaValues: (number | null)[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      smaValues.push(data[i].adjustedDolarValue);
      continue;
    }
    
    const slice = data.slice(i - period + 1, i + 1);
    const sum = slice.reduce((acc, val) => acc + val.adjustedDolarValue, 0);
    smaValues.push(sum / period);
  }
  
  return smaValues;
};