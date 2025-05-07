import React, { useEffect, useState } from 'react';
import type { IndicatorDetail as IndicatorDetailType, IndicatorCode } from '../types';
import { getIndicatorHistory } from '../services/indicatorService';
import IndicatorChart from './IndicatorChart';

interface IndicatorDetailProps {
  indicatorCode: IndicatorCode;
  indicatorName: string;
  onClose: () => void;
}

const IndicatorDetail: React.FC<IndicatorDetailProps> = ({
  indicatorCode,
  indicatorName,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<IndicatorDetailType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getIndicatorHistory(indicatorCode, selectedYear);
        setData(result);
        setError(null);
      } catch (err) {
        setError('Error al cargar los datos del indicador');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [indicatorCode, selectedYear]);

  // Generamos un array con los últimos 5 años para el selector
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{indicatorName}</h2>
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

        {!isLoading && !error && data?.serie && data.serie.length > 0 ? (
          <IndicatorChart 
            data={data.serie} 
            title={`Evolución ${indicatorName} - ${selectedYear}`} 
            unitLabel={data.unidad_medida} 
          />
        ) : !isLoading && !error ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            No hay datos disponibles para este período.
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default IndicatorDetail; 