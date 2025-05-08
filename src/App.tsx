import { useEffect, useState } from 'react'
import './App.css'
import type { Indicator, IndicatorCode } from './types'
import { getIndicators } from './services/indicatorService'
import IndicatorCard from './components/IndicatorCard'
import IndicatorDetail from './components/IndicatorDetail'
import IndicatorComparison from './components/IndicatorComparison'

// Mapeo de colores para los indicadores en la comparación
const indicatorColors: Record<IndicatorCode, string> = {
  uf: '#2563eb',
  ivp: '#9333ea',
  dolar: '#16a34a',
  dolar_intercambio: '#65a30d',
  euro: '#0891b2',
  ipc: '#d97706',
  utm: '#dc2626',
  imacec: '#db2777',
  tpm: '#4f46e5',
  libra_cobre: '#f59e0b',
  tasa_desempleo: '#7c3aed',
  bitcoin: '#f97316'
}

function App() {
  const [indicators, setIndicators] = useState<Record<string, Indicator>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedIndicator, setSelectedIndicator] = useState<{code: IndicatorCode, name: string} | null>(null)
  const [isComparing, setIsComparing] = useState(false)
  const [comparisonIndicators, setComparisonIndicators] = useState<{code: IndicatorCode, name: string, color: string}[]>([])

  useEffect(() => {
    const fetchIndicators = async () => {
      try {
        setIsLoading(true)
        const data = await getIndicators()
        setIndicators(data)
        setError(null)
      } catch (err) {
        setError('Error al cargar los indicadores económicos')
      } finally {
        setIsLoading(false)
      }
    }

    fetchIndicators()
  }, [])

  const handleIndicatorSelect = (code: IndicatorCode, name: string) => {
    setSelectedIndicator({ code, name })
  }

  const handleIndicatorCompare = (code: IndicatorCode, name: string) => {
    // Si ya está seleccionado para comparación, lo quitamos
    if (comparisonIndicators.some(i => i.code === code)) {
      setComparisonIndicators(comparisonIndicators.filter(i => i.code !== code))
    } 
    // Si no está seleccionado y hay menos de 3 indicadores, lo agregamos
    else if (comparisonIndicators.length < 3) {
      setComparisonIndicators([
        ...comparisonIndicators, 
        { 
          code, 
          name, 
          color: indicatorColors[code] 
        }
      ])
    }
  }

  const startComparison = () => {
    if (comparisonIndicators.length >= 2) {
      setIsComparing(true)
    }
  }

  // Filtrar indicadores principales (excluir version y autor)
  const mainIndicators = Object.entries(indicators)
    .filter(([key]) => key !== 'version' && key !== 'autor' && key !== 'fecha')
    .sort((a, b) => a[1].nombre.localeCompare(b[1].nombre))

  return (
    <div className="min-h-screen bg-gray-100 rounded-lg md:rounded-2xl py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }} className="font-bold text-gray-900 mb-2">Indicadores Económicos Chile</h1>
          <p style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }} className="text-gray-600 font-semibold">
            Datos actualizados de los principales indicadores económicos de Chile
          </p>
        </header>

        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <>
            {comparisonIndicators.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="space-y-4">
                  <div className='flex justify-between items-center flex-wrap gap-2'>
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Comparar Indicadores</h2>
                    
                    <button
                      className={`px-4 py-2 rounded font-semibold text-white ${
                        comparisonIndicators.length >= 2
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                      onClick={startComparison}
                      disabled={comparisonIndicators.length < 2}
                    >
                      Comparar
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                      {comparisonIndicators.map((indicator) => (
                        <div 
                          key={indicator.code}
                          className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg flex items-center"
                        >
                          <span>{indicator.name}</span>
                          <button 
                            className="ml-2 text-sm px-3 py-1 text-white"
                            onClick={() => handleIndicatorCompare(indicator.code, indicator.name)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mainIndicators.map(([code, indicator]) => (
                <div key={code} className="relative">
                  <IndicatorCard
                    indicator={indicator}
                    onClick={() => handleIndicatorSelect(code as IndicatorCode, indicator.nombre)}
                  />
                  <button
                    className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center ${
                      comparisonIndicators.some(i => i.code === code)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                    onClick={() => handleIndicatorCompare(code as IndicatorCode, indicator.nombre)}
                    title={
                      comparisonIndicators.some(i => i.code === code)
                        ? 'Quitar de comparación'
                        : 'Agregar a comparación'
                    }
                  >
                    {comparisonIndicators.some(i => i.code === code) ? '✓' : '+'}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {selectedIndicator && (
          <IndicatorDetail
            indicatorCode={selectedIndicator.code}
            indicatorName={selectedIndicator.name}
            onClose={() => setSelectedIndicator(null)}
          />
        )}

        {isComparing && (
          <IndicatorComparison
            indicators={comparisonIndicators}
            onClose={() => setIsComparing(false)}
          />
        )}

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Datos proporcionados por <a href="https://mindicador.cl" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">mindicador.cl</a></p>
        </footer>
      </div>
    </div>
  )
}

export default App
