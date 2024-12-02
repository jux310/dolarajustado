import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Chart } from './components/Chart';
import { fetchDolarBolsa, fetchUVA } from './services/api';
import { ChartData } from './types';
import { Loader2 } from 'lucide-react';
import { formatChartData } from './utils/formatters';

function App() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [dolarData, uvaData] = await Promise.all([
          fetchDolarBolsa(),
          fetchUVA()
        ]);
        
        const formattedData = formatChartData(dolarData, uvaData);
        setData(formattedData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load data. Please try again later.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Header />
        
        {loading ? (
          <div className="flex items-center justify-center h-[500px] bg-white rounded-xl shadow-lg">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[500px] bg-white rounded-xl shadow-lg">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <Chart data={data} />
        )}
        
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>Data provided by Argentina Datos API</p>
        </footer>
      </div>
    </div>
  );
}

export default App;