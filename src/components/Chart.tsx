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
import { format } from 'date-fns';
import { ChartData } from '../types';
import { ChartTooltip } from './ChartTooltip';

interface ChartProps {
  data: ChartData[];
}

export const Chart: React.FC<ChartProps> = ({ data }) => {
  if (!data?.length) {
    return (
      <div className="w-full h-[500px] bg-white p-4 rounded-xl shadow-lg flex items-center justify-center">
        <p className="text-gray-500">No hay datos disponibles</p>
      </div>
    );
  }

  const isFirstDayOfYear = (date: Date) => {
    return date.getMonth() === 0 && date.getDate() === 1;
  };

  return (
    <div className="w-full h-[500px] bg-white p-4 rounded-xl shadow-lg">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => {
              try {
                return format(new Date(date), 'yyyy');
              } catch (error) {
                return '';
              }
            }}
            ticks={data
              .filter((item, index) => {
                const date = new Date(item.date);
                return index === 0 || // Include first date
                  index === data.length - 1 || // Include last date
                  isFirstDayOfYear(date); // Include first day of each year
              })
              .map(item => item.date)
            }
            stroke="#6b7280"
          />
          <YAxis stroke="#6b7280" />
          <Tooltip content={<ChartTooltip />} />
          <Line
            type="monotone"
            dataKey="adjustedDolarValue"
            stroke="#ef4444"
            name="Dólar Ajustado"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};