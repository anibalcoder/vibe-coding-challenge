import React from 'react';
import { format, parseISO } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { IndicatorSeries } from '../types';

interface IndicatorChartProps {
  data: IndicatorSeries[];
  title: string;
  unitLabel: string;
}

const IndicatorChart: React.FC<IndicatorChartProps> = ({ 
  data, 
  title,
  unitLabel 
}) => {
  // Ordenamos los datos por fecha y limitamos a los últimos 30 días
  const chartData = [...data]
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
    .slice(-30)
    .map(item => ({
      ...item,
      fecha: format(parseISO(item.fecha), 'dd/MM/yyyy'),
    }));

  return (
    <div className="bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="fecha" 
              angle={-45}
              textAnchor="end"
              height={70}
              // interval={0}
              interval="preserveStartEnd"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={['auto', 'auto']} 
              label={{ 
                value: unitLabel, 
                angle: -90, 
                position: 'insideLeft' 
              }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="valor"
              stroke="#2563eb"
              activeDot={{ r: 8 }}
              name="Valor"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IndicatorChart; 