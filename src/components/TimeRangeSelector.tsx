import React from 'react';

type TimeRange = '1M' | '3M' | '6M' | '1Y' | '2Y' | '5Y' | 'ALL';

interface TimeRangeSelectorProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  selectedRange,
  onRangeChange,
}) => {
  const ranges: TimeRange[] = ['1M', '3M', '6M', '1Y', '2Y', '5Y', 'ALL'];

  return (
    <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-2 -mx-2 px-2">
      {ranges.map((range) => (
        <button
          key={range}
          onClick={() => onRangeChange(range)}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
            selectedRange === range
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-sm'
          }`}
        >
          {range}
        </button>
      ))}
    </div>
  );
};