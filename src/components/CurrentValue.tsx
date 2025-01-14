import React from 'react';
import { formatCurrency, formatDate } from '../utils/formatters';

interface CurrentValueProps {
  value: number;
  previousValue: number;
  label?: string;
}

export const CurrentValue: React.FC<CurrentValueProps> = ({ 
  value, 
  previousValue, 
  label = 'Valor actual:'
}) => {
  const difference = value - previousValue;
  const percentageChange = ((value / previousValue) - 1) * 100;
  const increased = difference > 0;

  return (
    <div className="bg-white dark:bg-gray-800 px-4 py-2 sm:px-6 sm:py-3 rounded-xl shadow-lg mb-4">
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {label}
        </span>
        <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
          {formatCurrency(value)}
        </div>
        <div className="flex-1" />
        <span className={`text-xs font-medium ${
          increased ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        }`}>
          {increased ? '▲' : '▼'} {percentageChange.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};