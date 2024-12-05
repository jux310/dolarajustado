import React from 'react';
import { useRef, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  ReferenceLine,
  Line,
  ReferenceDot,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
} from 'recharts';
import { format, differenceInMonths } from 'date-fns';
import { ChartData } from '../types';
import { ChartTooltip } from './ChartTooltip';
import { TimeRangeSelector } from './TimeRangeSelector';
import { EventLabelsToggle } from './EventLabelsToggle';
import { filterDataByTimeRange } from '../utils/dateRanges';
import { formatCurrency, formatDateDifference } from '../utils/formatters';
import { useTheme } from '../context/ThemeContext';
import { historicalEvents } from '../utils/events';

interface ChartProps {
  data: ChartData[];
}

export const Chart: React.FC<ChartProps> = ({ data }) => {
  const [timeRange, setTimeRange] = React.useState<'1M' | '6M' | '1Y' | '5Y' | 'ALL'>('5Y');
  const { theme } = useTheme();
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragEnd, setDragEnd] = useState<{ x: number; y: number } | null>(null);
  const chartRef = useRef<any>(null);
  const [showEventLabels, setShowEventLabels] = useState(true);

  const handleMouseDown = (e: any) => {
    if (e?.activeLabel) {
      const y = e.activePayload?.[0]?.value;
      setDragStart({ x: e.activeLabel, y });
      setDragEnd(null);
    }
  };

  const handleMouseMove = (e: any) => {
    if (dragStart && e?.activeLabel) {
      const y = e.activePayload?.[0]?.value;
      setDragEnd({ x: e.activeLabel, y });
    }
  };

  const handleMouseUp = () => {
    setDragStart(null);
    setDragEnd(null);
  };
  
  const getDataPoints = (data: ChartData[]) => {
    if (!data.length) return { max: null, min: null, current: null };
    
    let maxPoint = data[0];
    let minPoint = data[0];
    
    for (const point of data) {
      if (point.adjustedDolarValue > maxPoint.adjustedDolarValue) {
        maxPoint = point;
      }
      if (point.adjustedDolarValue < minPoint.adjustedDolarValue) {
        minPoint = point;
      }
    }
    
    return {
      max: maxPoint,
      min: minPoint,
      current: null
    };
  };
  
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
    
    const filtered = data.filter((item, index) => {
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
    });
    
    return filtered.map(item => item.date.getTime());
  };

  const { max, min, current } = getDataPoints(filteredData);
  const yAxisDomain = getYAxisDomain();

  return (
    <div className="w-full h-[600px] bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl backdrop-blur-sm backdrop-filter">
      <div className="flex justify-between items-center mb-4">
        <TimeRangeSelector
          selectedRange={timeRange}
          onRangeChange={setTimeRange}
        />
        <EventLabelsToggle
          showLabels={showEventLabels}
          onToggle={() => setShowEventLabels(!showEventLabels)}
        />
      </div>
      <div className="h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            ref={chartRef}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={theme === 'dark' ? '#2d3748' : '#f3f4f6'}
              opacity={0.5}
            />
            <XAxis
              dataKey={(item) => item.date.getTime()}
              tickFormatter={(timestamp) => getTickFormatter(timeRange)(new Date(timestamp))}
              ticks={getTickInterval(filteredData, timeRange)}
              stroke={theme === 'dark' ? '#9CA3AF' : '#4B5563'}
              fontSize={12}
              className="select-none"
            />
            <YAxis 
              domain={yAxisDomain}
              stroke={theme === 'dark' ? '#9CA3AF' : '#4B5563'}
              fontSize={12}
              className="select-none"
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
              stroke={theme === 'dark' ? '#60a5fa' : '#2563eb'}
              name="Dólar Ajustado"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            {historicalEvents
              .filter(event => {
                const eventTime = event.date.getTime();
                return eventTime >= filteredData[0].date.getTime() &&
                       eventTime <= filteredData[filteredData.length - 1].date.getTime();
              })
              .map((event, index) => (
                <ReferenceLine 
                  key={index}
                  x={event.date.getTime()}
                  stroke={showEventLabels ? (theme === 'dark' ? '#4b5563' : '#9ca3af') : 'transparent'}
                  strokeDasharray={showEventLabels ? "3 3" : "0"}
                  strokeWidth={showEventLabels ? 1.5 : 0}
                  isFront={true}
                  label={showEventLabels ? {
                    value: event.description,
                    angle: 270,
                    fill: theme === 'dark' ? '#9CA3AF' : '#6B7280',
                    fontSize: 12,
                    textAnchor: 'start',
                    offset: 15,
                    position: 'insideTopRight',
                    className: 'select-none'
                  } : undefined}
                />
              ))
            }
            {max && <ReferenceDot
              x={max.date.getTime()}
              y={max.adjustedDolarValue}
              r={4}
              fill={theme === 'dark' ? '#60a5fa' : '#2563eb'}
              isFront={true}
            />}
            {min && <ReferenceDot
              x={min.date.getTime()}
              y={min.adjustedDolarValue}
              r={4}
              fill={theme === 'dark' ? '#60a5fa' : '#2563eb'}
              isFront={true}
            />}
            {dragStart && dragEnd && (
              <>
                <ReferenceArea
                  x1={dragStart.x}
                  x2={dragStart.x}
                  stroke={theme === 'dark' ? '#4b5563' : '#9ca3af'}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
                <ReferenceArea
                  x1={dragEnd.x}
                  x2={dragEnd.x}
                  stroke={theme === 'dark' ? '#4b5563' : '#9ca3af'}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
                <ReferenceArea
                  x1={dragStart.x}
                  x2={dragEnd.x}
                  strokeOpacity={0.3}
                  fill={dragEnd.y > dragStart.y 
                    ? (theme === 'dark' ? '#22c55e' : '#4ade80')
                    : (theme === 'dark' ? '#ef4444' : '#f87171')}
                  fillOpacity={0.1}
                />
                {/* Background for price difference text */}
                <rect
                  x="50%"
                  y={5}
                  width={300}
                  height={70}
                  fill={theme === 'dark' ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)'}
                  rx={4}
                  transform="translate(-150, 0)"
                />
                {/* Price and time difference display */}
                <text
                  x="50%"
                  y={30}
                  textAnchor="middle"
                  fill={dragEnd.y > dragStart.y ? '#22c55e' : '#ef4444'}
                  fontSize={14}
                  fontWeight="500"
                  className="select-none"
                  style={{ paintOrder: 'stroke', stroke: theme === 'dark' ? '#111827' : '#ffffff', strokeWidth: 4 }}
                >
                  {dragEnd.y > dragStart.y ? '▲' : '▼'} {formatCurrency(Math.abs(dragEnd.y - dragStart.y))}
                  {' '}({((dragEnd.y / dragStart.y - 1) * 100).toFixed(2)}%)
                </text>
                <text
                  x="50%"
                  y={55}
                  textAnchor="middle"
                  fill={theme === 'dark' ? '#9CA3AF' : '#4B5563'}
                  fontSize={14}
                  fontWeight="500"
                  className="select-none"
                  style={{ paintOrder: 'stroke', stroke: theme === 'dark' ? '#111827' : '#ffffff', strokeWidth: 4 }}
                >
                  {formatDateDifference(new Date(dragStart.x), new Date(dragEnd.x))}
                </text>
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};