import React, { useEffect, useState } from 'react';
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
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    if (active) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [active, payload, label]);

  if (!active || !payload?.length || !label) {
    return null;
  }
  
  if (!isVisible) {
    return null;
  }

  try {
    const date = new Date(Number(label));
    const data = payload[0]?.payload as ChartData;
    const value = data.adjustedDolarValue;
    const event = !data.smaValue && historicalEvents.find(e => e.date.getTime() === date.getTime());
    
    let type = '';
    if (!data.smaValue) {
      if (data === payload[0]?.payload.max) type = 'Máximo';
      else if (data === payload[0]?.payload.min) type = 'Mínimo';
      else if (data === payload[0]?.payload.current) type = 'Actual';
    }

    return (
      <div className="bg-white/95 dark:bg-gray-800/95 p-3 sm:p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm max-w-[280px] sm:max-w-none select-none">
        <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base select-none">
          {type ? `${type} - ${formatDate(date)}` : formatDate(date)}
        </p>
        <div className="space-y-1">
          <p className="text-blue-600 dark:text-blue-400 font-medium text-sm sm:text-base select-none">
            Dólar Ajustado: {formatCurrency(value)}
          </p>
          {data.smaValue !== undefined && data.smaValue !== value && (
            <p className="text-gray-600 dark:text-gray-400 text-sm select-none">
              Media Móvil: {formatCurrency(data.smaValue)}
            </p>
          )}
        </div>
        {event && (
          <p className="mt-2 text-gray-600 dark:text-gray-400 text-xs sm:text-sm border-t border-gray-200 dark:border-gray-700 pt-2 select-none">
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