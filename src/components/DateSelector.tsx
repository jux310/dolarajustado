import React, { useState } from 'react';
import { ChartData } from '../types';
import { format } from 'date-fns';
import { formatCurrency, formatDate } from '../utils/formatters';

interface DateSelectorProps {
  data: ChartData[];
  className?: string;
}

interface ValueDifference {
  absolute: number;
  percentage: number;
  increased: boolean;
}

interface Values {
  adjusted: number;
  unadjusted: number;
}

export const DateSelector: React.FC<DateSelectorProps> = ({ data, className = '' }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [values, setValues] = useState<Values | null>(null);
  const [difference, setDifference] = useState<ValueDifference | null>(null);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = event.target.value;
    setSelectedDate(date);
    
    const dataPoint = data.find(point =>
      format(point.date, 'yyyy-MM-dd') === date
    );
    const currentValue = data[data.length - 1].adjustedDolarValue;

    if (dataPoint) {
      setValues({
        adjusted: dataPoint.adjustedDolarValue,
        unadjusted: dataPoint.dolarValue
      });
      
      const absoluteDiff = currentValue - dataPoint.adjustedDolarValue;
      const percentageDiff = ((currentValue / dataPoint.adjustedDolarValue) - 1) * 100;
      
      setDifference({
        absolute: absoluteDiff,
        percentage: percentageDiff,
        increased: absoluteDiff > 0
      });
    } else {
      setValues(null);
      setDifference(null);
    }
  };

  const minDate = format(data[0].date, 'yyyy-MM-dd');
  const maxDate = format(data[data.length - 1].date, 'yyyy-MM-dd');

  const currentValue = data[data.length - 1].adjustedDolarValue;

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="flex items-center gap-2">
        <label htmlFor="date-selector" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Seleccionar fecha:
        </label>
        <input
          type="date"
          id="date-selector"
          value={selectedDate}
          onChange={handleDateChange}
          min={minDate}
          max={maxDate}
          className="px-3 py-1.5 rounded-lg text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>
      {selectedDate && values && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600 dark:text-gray-400">Dólar Bolsa:</span>
            <span className="text-xs font-medium text-gray-900 dark:text-white">
              {formatCurrency(values.unadjusted)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600 dark:text-gray-400">Dólar Ajustado:</span>
            <span className="text-xs font-medium text-gray-900 dark:text-white">
              {formatCurrency(values.adjusted)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600 dark:text-gray-400">Valor actual:</span>
            <span className="text-xs font-medium text-gray-900 dark:text-white">
              {formatCurrency(currentValue)}
            </span>
          </div>
          {difference && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">Diferencia:</span>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${difference.increased ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {difference.increased ? '+' : '-'}{formatCurrency(Math.abs(difference.absolute))}
                </span>
                <span className={`text-xs ${difference.increased ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  ({difference.increased ? '▲' : '▼'} {difference.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};