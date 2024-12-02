import React from 'react';
import { formatDate, formatCurrency } from '../utils/formatters';

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export const ChartTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload?.length || !label) {
    return null;
  }

  try {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-medium text-gray-900 dark:text-white">
          {formatDate(new Date(label))}
        </p>
        <p className="text-blue-600 dark:text-blue-400">
          Dólar Ajustado: {formatCurrency(payload[0]?.value ?? 0)}
        </p>
      </div>
    );
  } catch (error) {
    console.error('Error rendering tooltip:', error);
    return null;
  }
};