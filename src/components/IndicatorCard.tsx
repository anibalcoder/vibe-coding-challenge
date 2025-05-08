import React from 'react';
import type { Indicator } from '../types';
import { format } from 'date-fns';

interface IndicatorCardProps {
  indicator: Indicator;
  onClick: () => void;
}

const IndicatorCard: React.FC<IndicatorCardProps> = ({ indicator, onClick }) => {
  const formattedDate = indicator.fecha 
    ? format(new Date(indicator.fecha), 'dd/MM/yyyy')
    : 'Fecha no disponible';

  return (
    <div 
      className="bg-gray-200 rounded-lg shadow-lg p-4 hover:bg-gray-300 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <h3 className="text-xl font-bold text-gray-800">{indicator.nombre}</h3>
      <p className="text-2xl font-bold text-blue-600 my-2">
        {indicator.valor.toLocaleString('es-CL', { maximumFractionDigits: 2 })} 
        {indicator.unidad_medida === 'Pesos' ? ' CLP' : indicator.unidad_medida}
      </p>
      <p className="text-sm md:text-base text-yellow-500 font-semibold">{formattedDate}</p>
    </div>
  );
};

export default IndicatorCard; 