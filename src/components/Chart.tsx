import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { format, differenceInMonths } from 'date-fns';
import { ChartData } from '../types';
import { ChartTooltip } from './ChartTooltip';
import { TimeRangeSelector } from './TimeRangeSelector';
import { filterDataByTimeRange } from '../utils/dateRanges';
import { useTheme } from '../context/ThemeContext';

interface ChartProps {
  data: ChartData[];
}

export const Chart: React.FC<ChartProps> = ({ data }) => {
  const [timeRange, setTimeRange] = React.useState<'1M' | '6M' | '1Y' | '5Y' | 'ALL'>('5Y');
  const { theme } = useTheme();
  
  if (!data?.length) {
    return (
      <div className="w-full h-[500px] bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">No hay datos disponibles</p>
      </div>
    );
  }

  const filteredData = filterDataByTimeRange(data, timeRange);

  const getYAxisDomain = () => {
    if (!filteredData.length) return [0, 'auto'];
    
    const values = filteredData.map(item => item.adjustedDolarValue);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1;

    return [
      Math.max(0, min - padding),
      max + padding
    ];
  };

  const getTickFormatter = (range: typeof timeRange) => {
    switch (range) {
      case '1M':
        return (date: Date) => format(new Date(date), 'dd/MM');
      case '6M':
        return (date: Date) => format(new Date(date), 'MM/yyyy');
      case '1Y':
        return (date: Date) => format(new Date(date), 'MM/yyyy');
      default:
        return (date: Date) => format(new Date(date), 'yyyy');
    }
  };

  const getTickInterval = (data: ChartData[], range: typeof timeRange) => {
    if (!data.length) return [];
    
    return data.filter((item, index) => {
      const date = new Date(item.date);
      
      switch (range) {
        case '1M':
          return index === 0 || index === data.length - 1 || index % Math.floor(data.length / 6) === 0;
        case '6M':
          return date.getDate() === 1 || index === data.length - 1;
        case '1Y':
          return (date.getDate() === 1 && date.getMonth() % 2 === 0) || index === data.length - 1;
        default:
          return (date.getMonth() === 0 && date.getDate() === 1) || index === data.length - 1;
      }
    }).map(item => item.date);
  };

  const yAxisDomain = getYAxisDomain();

  return (
    <div className="w-full h-[600px] bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
      <TimeRangeSelector
        selectedRange={timeRange}
        onRangeChange={setTimeRange}
      />
      <div className="h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={theme === 'dark' ? '#374151' : '#f0f0f0'} 
            />
            <XAxis
              dataKey="date"
              tickFormatter={getTickFormatter(timeRange)}
              ticks={getTickInterval(filteredData, timeRange)}
              stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
            />
            <YAxis 
              domain={yAxisDomain}
              stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
              tickFormatter={(value) => new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: 'ARS',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(value)}
            />
            <Tooltip content={<ChartTooltip />} />
            <Line
              type="monotone"
              dataKey="adjustedDolarValue"
              stroke="#2563eb"
              name="Dólar Ajustado"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};