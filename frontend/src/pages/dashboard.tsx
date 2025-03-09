import { useState, useEffect } from 'react';
import { StockChart } from '../components/StockChart';
import { StockTable } from '../components/StockTable';
import type { StockData } from '../types/stock';
import toast from 'react-hot-toast';
import { Select } from '../components/ui/Select';
import { Loader } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

const Dashboard = () => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [selectedCode, setSelectedCode] = useState<string>('');
  const [tradeCodes, setTradeCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchTradeCodes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/trade-codes`);
        if (!response.ok) throw new Error('Failed to fetch trade codes');
        const codes = await response.json();
        setTradeCodes(codes);
        setSelectedCode(codes[0] || '');
      } catch (error) {
        console.error('Error fetching trade codes:', error);
        toast.error('Failed to fetch trade codes');
      }
    };

    fetchTradeCodes();
  }, []);

  useEffect(() => {
    const fetchStockData = async () => {
      if (!selectedCode) return;
      
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/stocks?trade_code=${encodeURIComponent(selectedCode)}`
        );
        
        if (!response.ok) throw new Error('Failed to fetch stock data');
        const data = await response.json();
        
        setStockData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stock data:', error);
        toast.error('Failed to fetch stock data');
        setLoading(false);
      }
    };

    fetchStockData();
  }, [selectedCode]);

  const handleEdit = async (row: StockData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/stocks/${row.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(row),
      });

      if (!response.ok) throw new Error('Update failed');
      
      toast.success('Record updated successfully');
      
  
      const updatedResponse = await fetch(
        `${API_BASE_URL}/stocks?trade_code=${encodeURIComponent(selectedCode)}`
      );
      const updatedData = await updatedResponse.json();
      setStockData(updatedData);
    } catch (error) {
      console.error('Error updating record:', error);
      toast.error('Failed to update record');
    }
  };


  const chartData = {
    labels: stockData.map(item => item.date),
    datasets: [
      {
        label: 'Close Price',
        data: stockData.map(item => item.close),
        priceType: 'close',
      },
      {
        label: 'Open Price',
        data: stockData.map(item => item.open),
        priceType: 'open',
      },
      {
        label: 'High Price',
        data: stockData.map(item => item.high),
        priceType: 'high',
      },
      {
        label: 'Low Price',
        data: stockData.map(item => item.low),
        priceType: 'low',
      },
      {
        label: 'Volume',
        data: stockData.map(item => item.volume),
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen min-w-screen flex items-center justify-center bg-gray-50">
        <Loader className="h-12 w-12 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Stock Analytics Dashboard</h1>
          <Select
            value={selectedCode}
            onChange={(value: string) => setSelectedCode(value)}
            options={tradeCodes.map(code => ({ value: code, label: code }))}
            className="w-64"
          />
        </div>

        <StockChart
          data={chartData}
          title={`${selectedCode} Market Performance`}
        />

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Historical Data</h2>
          <StockTable data={stockData} onEdit={handleEdit} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;