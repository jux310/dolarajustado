import React from 'react';

type TimeRange = '1M' | '6M' | '1Y' | '5Y' | 'ALL';

interface TimeRangeSelectorProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  selectedRange,
  onRangeChange,
}) => {
  const ranges: TimeRange[] = ['1M', '6M', '1Y', '5Y', 'ALL'];

  return (
    <div className="flex gap-2 mb-4">
      {ranges.map((range) => (
        <button
          key={range}
          onClick={() => onRangeChange(range)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedRange === range
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {range}
        </button>
      ))}
    </div>
  );
};