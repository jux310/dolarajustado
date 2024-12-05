import React from 'react';
import { formatDate, formatCurrency } from '../utils/formatters';
import { ChartData } from '../types';
import { historicalEvents } from '../utils/events';

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  labelFormatter?: (label: string) => string;
}

export const ChartTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload?.length || !label) {
    return null;
  }

  try {
    const date = new Date(Number(label));
    const value = payload[0]?.value;
    const data = payload[0]?.payload as ChartData;
    const event = historicalEvents.find(e => e.date.getTime() === date.getTime());
    
    let type = '';
    if (data === payload[0]?.payload.max) type = 'Máximo';
    else if (data === payload[0]?.payload.min) type = 'Mínimo';
    else if (data === payload[0]?.payload.current) type = 'Actual';

    return (
      <div className="bg-white/95 dark:bg-gray-800/95 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
        <p className="font-medium text-gray-900 dark:text-white">
          {type ? `${type} - ${formatDate(date)}` : formatDate(date)}
        </p>
        <p className="text-blue-600 dark:text-blue-400 font-medium">
          Dólar Ajustado: {formatCurrency(value ?? 0)}
        </p>
        {event && (
          <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-700 pt-2">
            {event.description}
          </p>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error rendering tooltip:', error);
    return null;
  }
};