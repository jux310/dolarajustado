import React from 'react';
import { TrendingUp } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const Header: React.FC = () => {
  return (
    <header className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dólar Bolsa Ajustado por Inflación
          </h1>
        </div>
        <ThemeToggle />
      </div>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Evolución histórica del valor del Dólar Bolsa ajustado por Inflación
      </p>
    </header>
  );
};