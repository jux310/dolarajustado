import React from 'react';
import { Github } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 space-y-2">
      <p>Data provided by Argentina Datos API</p>
      <a
        href="https://github.com/jux310/dolarajustado"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 sm:gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span>View on GitHub</span>
      </a>
    </footer>
  );
};