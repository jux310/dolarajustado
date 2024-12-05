import React from 'react';
import { Tag, Tags } from 'lucide-react';

interface EventLabelsToggleProps {
  showLabels: boolean;
  onToggle: () => void;
}

export const EventLabelsToggle: React.FC<EventLabelsToggleProps> = ({
  showLabels,
  onToggle,
}) => {
  return (
    <button
      onClick={onToggle}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
        ${showLabels
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        }
      `}
      title={showLabels ? 'Ocultar eventos' : 'Mostrar eventos'}
    >
      {showLabels ? (
        <>
          <Tag className="w-4 h-4" />
          <span>Eventos</span>
        </>
      ) : (
        <>
          <Tags className="w-4 h-4" />
          <span>Eventos</span>
        </>
      )}
    </button>
  );
};