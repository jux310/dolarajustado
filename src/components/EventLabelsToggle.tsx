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
      className="p-2 rounded-lg transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
      title={showLabels ? 'Ocultar eventos' : 'Mostrar eventos'}
    >
      {showLabels ? (
        <Tag className="w-5 h-5" />
      ) : (
        <Tags className="w-5 h-5" />
      )}
    </button>
  );
};