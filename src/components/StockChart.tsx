import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Line } from 'react-chartjs-2';
  import type { ChartData } from '../types/stock';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  
  interface StockChartProps {
    data: ChartData;
    title: string;
  }
  
  export function StockChart({ data, title }: StockChartProps) {
    const options = {
      responsive: true,
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      plugins: {
        title: {
          display: true,
          text: title,
        },
      },
      scales: {
        y1: {
          type: 'linear' as const,
          display: true,
          position: 'left' as const,
          title: {
            display: true,
            text: 'Price',
          },
        },
        y2: {
          type: 'linear' as const,
          display: true,
          position: 'right' as const,
          title: {
            display: true,
            text: 'Volume',
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      },
    };
  
    return <Line options={options} data={data} />;
  }