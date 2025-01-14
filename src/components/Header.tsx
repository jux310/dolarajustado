import React from 'react';
import { TrendingUp, Calendar, LineChart } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { SMAToggle } from './SMAToggle';
import { EventLabelsToggle } from './EventLabelsToggle';

interface HeaderProps {
  showEventLabels: boolean;
  onToggleEvents: () => void;
  showDateSelector: boolean;
  onToggleDateSelector: () => void;
  smoothEnabled: boolean;
  onToggleSmooth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  showEventLabels,
  onToggleEvents,
  showDateSelector,
  onToggleDateSelector,
  smoothEnabled,
  onToggleSmooth
}) => {
  return (
    <header>
      <div className="flex items-center gap-2 sm:gap-3">
        <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Dólar Bolsa Ajustado por Inflación
        </h1>
      </div>
      <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Evolución histórica del valor del Dólar Bolsa ajustado por Inflación
        </p>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToggleDateSelector}
            className="p-2 rounded-lg transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            title={showDateSelector ? 'Ocultar selector de fecha' : 'Mostrar selector de fecha'}
          >
            <Calendar className="w-5 h-5" />
          </button>
          <button
            onClick={onToggleSmooth}
            className="p-2 rounded-lg transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            title={smoothEnabled ? 'Desactivar suavizado' : 'Activar suavizado'}
          >
            <LineChart className="w-5 h-5" />
          </button>
          <EventLabelsToggle
            showLabels={showEventLabels}
            onToggle={onToggleEvents}
          />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};