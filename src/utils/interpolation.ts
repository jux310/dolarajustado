import { ChartData } from '../types';
import { eachDayOfInterval } from 'date-fns';

const findNearestPoints = (
  date: Date,
  data: ChartData[]
): { prev: ChartData | null; next: ChartData | null } => {
  let prev: ChartData | null = null;
  let next: ChartData | null = null;

  for (let i = 0; i < data.length; i++) {
    if (data[i].date < date) {
      prev = data[i];
    } else if (data[i].date > date) {
      next = data[i];
      break;
    }
  }

  return { prev, next };
};

export const interpolateValue = (
  date: Date,
  prevPoint: ChartData | null,
  nextPoint: ChartData | null,
  valueKey: 'dolarValue' | 'uvaValue' | 'adjustedDolarValue'
): number => {
  // If we don't have both points for interpolation, use the nearest available value
  if (!prevPoint && !nextPoint) return 0;
  if (!prevPoint) return nextPoint![valueKey];
  if (!nextPoint) return prevPoint[valueKey];

  // Skip interpolation if either point has zero value
  if (prevPoint[valueKey] === 0 || nextPoint[valueKey] === 0) {
    return prevPoint[valueKey] || nextPoint[valueKey];
  }

  const timeDiff = nextPoint.date.getTime() - prevPoint.date.getTime();
  const currentDiff = date.getTime() - prevPoint.date.getTime();
  const ratio = currentDiff / timeDiff;

  const valueDiff = nextPoint[valueKey] - prevPoint[valueKey];
  return prevPoint[valueKey] + (valueDiff * ratio);
};

export const fillMissingDates = (data: ChartData[]): ChartData[] => {
  if (data.length < 2) return data;

  // Remove entries where both values are zero
  const filteredData = data.filter(point => 
    point.dolarValue > 0 || point.uvaValue > 0 || point.adjustedDolarValue > 0
  );
  
  // Sort data by date
  const sortedData = [...filteredData].sort((a, b) => a.date.getTime() - b.date.getTime());

  // Get all dates between start and end
  const dateRange = eachDayOfInterval({
    start: sortedData[0].date,
    end: sortedData[sortedData.length - 1].date
  });

  // Fill in missing dates with interpolated values
  const filledData: ChartData[] = dateRange.map(date => {
    const existingPoint = sortedData.find(
      point => point.date.getTime() === date.getTime()
    );

    if (existingPoint) {
      return existingPoint;
    }

    const { prev, next } = findNearestPoints(date, sortedData);

    return {
      date,
      dolarValue: interpolateValue(date, prev, next, 'dolarValue'),
      uvaValue: interpolateValue(date, prev, next, 'uvaValue'),
      adjustedDolarValue: interpolateValue(date, prev, next, 'adjustedDolarValue')
    };
  });

  // Final filtering to remove any remaining zero values
  return filledData.filter(point => 
    point.dolarValue > 0 && point.uvaValue > 0 && point.adjustedDolarValue > 0
  );
};