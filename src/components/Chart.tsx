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
import { calculateSMA } from '../utils/sma';
import { formatCurrency, formatDateDifference } from '../utils/formatters';
import { useTheme } from '../context/ThemeContext';
import { historicalEvents } from '../utils/events';

interface ChartProps {
  data: ChartData[];
  showEventLabels: boolean;
  smoothEnabled: boolean;
}

export const Chart: React.FC<ChartProps> = ({ data, showEventLabels, smoothEnabled }) => {
  const [timeRange, setTimeRange] = React.useState<'1M' | '3M' | '6M' | '1Y' | '2Y' | '5Y' | 'ALL'>('1Y');
  const { theme } = useTheme();
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragEnd, setDragEnd] = useState<{ x: number; y: number } | null>(null);
  const chartRef = useRef<any>(null);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [doubleTapActive, setDoubleTapActive] = useState(false);

  const handleMouseDown = (e: any) => {
    if (window.innerWidth < 640) {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTapTime;
      
      // Check for double tap
      if (tapLength < 300) {
        setDoubleTapActive(true);
        if (e?.activeLabel) {
          const y = e.activePayload?.[0]?.value;
          setDragStart({ x: e.activeLabel, y });
          setDragEnd(null);
          setIsDragging(true);
        }
      } else {
        setDoubleTapActive(false);
      }
      
      setLastTapTime(currentTime);
      return;
    }
    
    if (e?.activeLabel) {
      const y = e.activePayload?.[0]?.value;
      setDragStart({ x: e.activeLabel, y });
      setDragEnd(null);
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: any) => {
    if ((window.innerWidth >= 640 || doubleTapActive) && isDragging && dragStart && e?.activeLabel) {
      const y = e.activePayload?.[0]?.value;
      setDragEnd({ x: e.activeLabel, y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (!doubleTapActive) {
      setDragStart(null);
      setDragEnd(null);
    }
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
  
  // Determine SMA period based on time range
  const getSMAPeriod = () => {
    switch (timeRange) {
      case '1M': return 5;
      case '3M': return 7;
      case '6M': return 10;
      case '1Y': return 20;
      case '2Y': return 30;
      case '5Y': return 50;
      case 'ALL': return 100;
      default: return 20;
    }
  };
  
  const smaPeriod = getSMAPeriod();
  const smaValues = smoothEnabled ? calculateSMA(filteredData, smaPeriod) : [];
  
  // Add SMA values to the filtered data
  const enhancedData = filteredData.map((item, index) => ({
    ...item,
    smaValue: smaValues[index] || item.adjustedDolarValue
  }));

  const getYAxisDomain = () => {
    if (!enhancedData.length) return [0, 'auto'];
    
    const values = enhancedData.map(item => {
      const vals = [item.adjustedDolarValue];
      if (item.smaValue !== null) vals.push(item.smaValue);
      return vals;
    }).flat();
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.05;

    return [
      Math.max(0, min - padding),
      max + padding
    ];
  };

  const getYAxisTicks = () => {
    if (!filteredData.length) return [];
    
    const [minDomain, maxDomain] = getYAxisDomain();
    const range = maxDomain - minDomain;
    
    // Calculate a nice interval that will give us 5-7 ticks
    const roughInterval = range / 6;
    const magnitude = Math.pow(10, Math.floor(Math.log10(roughInterval)));
    const normalizedInterval = roughInterval / magnitude;
    
    let interval;
    if (normalizedInterval < 1.5) interval = magnitude;
    else if (normalizedInterval < 3) interval = 2 * magnitude;
    else if (normalizedInterval < 7) interval = 5 * magnitude;
    else interval = 10 * magnitude;
    
    const firstTick = Math.ceil(minDomain / interval) * interval;
    const ticks = [];
    
    for (let tick = firstTick; tick <= maxDomain; tick += interval) {
      ticks.push(tick);
    }
    
    return ticks;
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
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl backdrop-blur-sm backdrop-filter">
      <div className="px-3 sm:px-6 pt-3 sm:pt-6">
        <div className="space-y-3">
          <TimeRangeSelector
            selectedRange={timeRange}
            onRangeChange={setTimeRange}
          />
        </div>
      </div>
      <div className="h-[400px] sm:h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={enhancedData}
            margin={{ 
              top: 20,
              right: window.innerWidth < 640 ? 5 : 10,
              left: window.innerWidth < 640 ? 0 : 10,
              bottom: 10
            }}
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
              ticks={window.innerWidth < 640 ? getTickInterval(filteredData, timeRange).filter((_, i) => i % 2 === 0) : getTickInterval(filteredData, timeRange)}
              stroke={theme === 'dark' ? '#9CA3AF' : '#4B5563'}
              fontSize={12}
              className="select-none"
            />
            <YAxis 
              domain={yAxisDomain}
              stroke={theme === 'dark' ? '#9CA3AF' : '#4B5563'}
              fontSize={12}
              width={window.innerWidth < 640 ? 65 : 85}
              ticks={getYAxisTicks()}
              tickMargin={0}
              tickSize={0}
              axisLine={{ strokeWidth: 1 }}
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
              dataKey={smoothEnabled ? 'smaValue' : 'adjustedDolarValue'}
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
                    fontSize: window.innerWidth < 640 ? 10 : 12,
                    textAnchor: 'start',
                    offset: window.innerWidth < 640 ? 10 : 15,
                    position: 'insideTopRight',
                    className: 'select-none'
                  } : undefined}
                />
              ))
            }
            {!smoothEnabled && max && <ReferenceDot
              x={max.date.getTime()}
              y={max.adjustedDolarValue}
              r={4}
              fill={theme === 'dark' ? '#60a5fa' : '#2563eb'}
              isFront={true}
            />}
            {!smoothEnabled && min && <ReferenceDot
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
                  width={window.innerWidth < 640 ? 240 : 300}
                  height={window.innerWidth < 640 ? 60 : 70}
                  fill={theme === 'dark' ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)'}
                  rx={4}
                  transform={`translate(${window.innerWidth < 640 ? -120 : -150}, 0)`}
                />
                {/* Price and time difference display */}
                <text
                  x="50%"
                  y={30}
                  textAnchor="middle"
                  fill={dragEnd.y > dragStart.y ? '#22c55e' : '#ef4444'}
                  fontSize={window.innerWidth < 640 ? 12 : 14}
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
                  fontSize={window.innerWidth < 640 ? 12 : 14}
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