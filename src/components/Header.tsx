import React from 'react';
import { TrendingUp } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="mb-8">
      <div className="flex items-center gap-3">
        <TrendingUp className="w-8 h-8 text-red-600" />
        <h1 className="text-3xl font-bold text-gray-900">
          Dólar Bolsa Ajustado por Inflación
        </h1>
      </div>
      <p className="mt-2 text-gray-600">
        Evolución histórica del valor del Dólar Bolsa ajustado por Inflación
      </p>
    </header>
  );
};