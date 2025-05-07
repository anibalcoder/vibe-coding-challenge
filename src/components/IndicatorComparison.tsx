import React, { useEffect, useState } from 'react';
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
import type { IndicatorCode } from '../types';
import { getIndicatorHistory } from '../services/indicatorService';

interface IndicatorComparisonProps {
  indicators: { code: IndicatorCode; name: string; color: string }[];
  onClose: () => void;
}

interface ComparisonDataPoint {
  fecha: string;
  [key: string]: string | number;
}

const IndicatorComparison: React.FC<IndicatorComparisonProps> = ({
  indicators,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ComparisonDataPoint[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Obtener datos para cada indicador
        const indicatorPromises = indicators.map(indicator => 
          getIndicatorHistory(indicator.code, selectedYear)
        );
        
        const results = await Promise.all(indicatorPromises);
        
        // Creamos un mapa para combinar los datos por fecha
        const dataMap = new Map<string, ComparisonDataPoint>();
        
        // Procesamos los resultados
        results.forEach((result, index) => {
          const indicator = indicators[index];
          
          if (result && result.serie) {
            result.serie.forEach(item => {
              const dateKey = item.fecha;
              
              if (!dataMap.has(dateKey)) {
                dataMap.set(dateKey, { 
                  fecha: format(parseISO(dateKey), 'dd/MM/yyyy'),
                });
              }
              
              const dataPoint = dataMap.get(dateKey)!;
              dataPoint[indicator.code] = item.valor;
            });
          }
        });
        
        // Convertimos el mapa a un array y ordenamos por fecha
        const combinedData = Array.from(dataMap.values())
          .sort((a, b) => {
            const dateA = new Date(parseISO(a.fecha.split('/').reverse().join('-')));
            const dateB = new Date(parseISO(b.fecha.split('/').reverse().join('-')));
            return dateA.getTime() - dateB.getTime();
          });
        
        setData(combinedData);
        setError(null);
      } catch (err) {
        setError('Error al cargar los datos para la comparación');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [indicators, selectedYear]);

  // Generamos un array con los últimos 5 años para el selector
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Comparación de Indicadores</h2>
          <button 
            className="text-gray-500 hover:text-gray-700" 
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="year-select" className="block text-sm font-medium text-gray-700 mb-1">
            Seleccionar año:
          </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center mb-4 space-x-4">
          {indicators.map((indicator) => (
            <div key={indicator.code} className="flex items-center">
              <div 
                className="w-4 h-4 mr-2 rounded-full" 
                style={{ backgroundColor: indicator.color }}
              />
              <span>{indicator.name}</span>
            </div>
          ))}
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {!isLoading && !error && data.length > 0 ? (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="fecha" 
                  angle={-45} 
                  textAnchor="end" 
                  height={70}
                  interval={Math.max(0, Math.floor(data.length / 15))}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                {indicators.map((indicator) => (
                  <Line
                    key={indicator.code}
                    type="monotone"
                    dataKey={indicator.code}
                    name={indicator.name}
                    stroke={indicator.color}
                    activeDot={{ r: 8 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : !isLoading && !error ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            No hay datos disponibles para este período.
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default IndicatorComparison; 