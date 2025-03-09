import { useState, useEffect } from 'react';
import { StockChart } from '../components/StockChart';
import { StockTable } from '../components/StockTable';
import { supabase } from '../client/SupabaseClient';
import type { StockData } from '../types/stock';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [data, setData] = useState<StockData[]>([]);
  const [selectedCode, setSelectedCode] = useState<string>('');
  const [tradeCodes, setTradeCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: stockData, error } = await supabase
        .from('stock')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;

      console.log('Fetched data:', stockData);

      setData(stockData);
      const codes = [...new Set(stockData.map(item => item.trade_code))];
      setTradeCodes(codes);
      setSelectedCode(codes[0]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
      setLoading(false);
    }
  };

  const handleEdit = async (row: StockData) => {
    try {
      const { error } = await supabase
        .from('stock')
        .update({
          high: row.high,
          low: row.low,
          open: row.open,
          close: row.close,
          volume: row.volume,
        })
        .eq('id', row.id);

      if (error) throw error;
      toast.success('Record updated successfully');
      fetchData();
    } catch (error) {
      console.error('Error updating record:', error);
      toast.error('Failed to update record');
    }
  };

  const filteredData = data.filter(item => item.trade_code === selectedCode);

  const chartData = {
    labels: filteredData.map(item => item.date),
    datasets: [
      {
        label: 'Close Price',
        data: filteredData.map(item => item.close),
        borderColor: 'rgb(75, 192, 192)',
        yAxisID: 'y1',
      },
      {
        label: 'Volume',
        data: filteredData.map(item => item.volume),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: 'y2',
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-7xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-full mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Trade Code
                  </label>
                  <select
                    value={selectedCode}
                    onChange={(e) => setSelectedCode(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    {tradeCodes.map(code => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-8">
                  <StockChart
                    data={chartData}
                    title={`Stock Price and Volume for ${selectedCode}`}
                  />
                </div>
                <div>
                  <StockTable data={filteredData} onEdit={handleEdit} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;