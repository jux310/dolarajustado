import React from 'react';
import { LineChart } from 'lucide-react';

interface SMAToggleProps {
  enabled: boolean;
  period: number;
  onToggle: () => void;
  onPeriodChange: (period: number) => void;
}

export const SMAToggle: React.FC<SMAToggleProps> = ({
  enabled,
  period,
  onToggle,
  onPeriodChange,
}) => {
  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onPeriodChange(Number(e.target.value));
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggle}
        className="p-2 rounded-lg transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        title={enabled ? 'Desactivar suavizado' : 'Activar suavizado'}
      >
        <LineChart className="w-5 h-5" />
      </button>
      {enabled && (
        <select
          value={period}
          onChange={handlePeriodChange}
          className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg text-sm px-2 py-1.5 border-none outline-none"
        >
          <option value="5">SMA5</option>
          <option value="10">SMA10</option>
          <option value="20">SMA20</option>
          <option value="50">SMA50</option>
        </select>
      )}
    </div>
  );
};