import { subMonths, subYears, startOfDay } from 'date-fns';
import { ChartData } from '../types';

export const filterDataByTimeRange = (
  data: ChartData[],
  range: '1M' | '3M' | '6M' | '1Y' | '2Y' | '5Y' | 'ALL'
): ChartData[] => {
  if (range === 'ALL' || !data.length) {
    return data;
  }

  const today = startOfDay(new Date());
  let startDate: Date;

  switch (range) {
    case '1M':
      startDate = subMonths(today, 1);
      break;
    case '3M':
      startDate = subMonths(today, 3);
      break;
    case '6M':
      startDate = subMonths(today, 6);
      break;
    case '1Y':
      startDate = subYears(today, 1);
      break;
    case '2Y':
      startDate = subYears(today, 2);
      break;
    case '5Y':
      startDate = subYears(today, 5);
      break;
    default:
      return data;
  }

  return data.filter(item => item.date >= startDate);
};