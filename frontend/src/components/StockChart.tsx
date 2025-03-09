import React, { useState } from 'react';
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
  Filler,
  ArcElement,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import type { ChartData } from '../types/stock';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

interface ExtendedChartData extends ChartData {
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    yAxisID?: string;
    priceType?: string;
  }[];
}

interface StockChartProps {
  data: ExtendedChartData;
  title: string;
  height?: number;
}

type ChartType = 'line' | 'pie';
type PriceType = 'close' | 'open' | 'high' | 'low';

export function StockChart({ 
  data, 
  title, 
  height = 400
}: StockChartProps) {
  const [activeChartType, setActiveChartType] = useState<ChartType>('line');
  const [activePriceType, setActivePriceType] = useState<PriceType>('close');

  const colorPalette = {
    primary: 'rgb(65, 105, 225)', // Royal Blue
    primaryLight: 'rgba(65, 105, 225, 0.4)',
    secondary: 'rgb(46, 204, 113)', // Emerald Green
    secondaryLight: 'rgba(46, 204, 113, 0.6)',
    accent1: 'rgb(241, 196, 15)', // Sunflower Yellow
    accent2: 'rgb(231, 76, 60)', // Pomegranate Red
    accent3: 'rgb(155, 89, 182)', // Amethyst Purple
    accent4: 'rgb(52, 152, 219)', // Peter River Blue
    accent5: 'rgb(230, 126, 34)', // Carrot Orange
    background: 'rgba(236, 240, 241, 0.7)', // Cloud White

    tabActive: 'rgb(52, 152, 219)',
    tabInactive: 'rgb(189, 195, 199)',
    tabText: 'white',
    tabInactiveText: '#333'
  };

  const getPieChartColors = () => {
    return [
      colorPalette.primary,
      colorPalette.secondary,
      colorPalette.accent1,
      colorPalette.accent2,
      colorPalette.accent3,
      colorPalette.accent4,
      colorPalette.accent5,
    ];
  };

  const getSelectedPriceDataset = () => {
    const priceDatasets = data.datasets.filter(
      dataset => dataset.priceType === activePriceType
    );
    
    if (priceDatasets.length === 0) {
      const labelMatchDatasets = data.datasets.filter(
        dataset => dataset.label.toLowerCase().includes(activePriceType.toLowerCase())
      );
      
      if (labelMatchDatasets.length > 0) {
        return labelMatchDatasets[0];
      }

      return data.datasets.find(ds => !ds.label.toLowerCase().includes('volume')) || data.datasets[0];
    }
    
    return priceDatasets[0];
  };


  const getFilteredData = () => {

    if (!data || !data.datasets || data.datasets.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    const priceDataset = getSelectedPriceDataset();

    const volumeDataset = data.datasets.find(
      dataset => dataset.label.toLowerCase().includes('volume')
    );

    return {
      labels: data.labels || [],
      datasets: priceDataset ? (
        volumeDataset ? [priceDataset, volumeDataset] : [priceDataset]
      ) : []
    };
  };

  const generateLineChartConfig = () => {
    const filteredData = getFilteredData();
    
    if (!filteredData.datasets || filteredData.datasets.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }
    
    return {
      labels: filteredData.labels,
      datasets: filteredData.datasets.map((dataset, index) => {
        if (!dataset || !dataset.data) {
          return {
            type: 'line' as const,
            label: 'No Data',
            data: [],
            borderColor: colorPalette.primary,
            backgroundColor: colorPalette.primaryLight,
            yAxisID: 'y1',
          };
        }
        
        if (index === 0 || !dataset.label || !dataset.label.toLowerCase().includes('volume')) {
          return {
            type: 'line' as const,
            label: `${activePriceType.charAt(0).toUpperCase() + activePriceType.slice(1)} Price`,
            data: dataset.data,
            borderColor: colorPalette.primary,
            backgroundColor: colorPalette.primaryLight,
            yAxisID: 'y1',
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: colorPalette.primary,
            pointBorderColor: '#fff',
            pointHoverRadius: 5,
            tension: 0.3,
            fill: false
          };
        } else {
          return {
            type: 'bar' as const,
            label: dataset.label,
            data: dataset.data,
            backgroundColor: colorPalette.secondaryLight,
            borderColor: colorPalette.secondary,
            borderWidth: 1,
            yAxisID: 'y2'
          };
        }
      })
    };
  };


  const generatePieChartConfig = () => {
    const filteredData = getFilteredData();
    

    const dataset = filteredData.datasets && filteredData.datasets.length > 0 
      ? filteredData.datasets[0] 
      : null;
    
    if (!dataset || !dataset.data) {
      return {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: getPieChartColors(),
          borderColor: '#ffffff',
          borderWidth: 2,
        }]
      };
    }
    
    return {
      labels: filteredData.labels,
      datasets: [
        {
          data: dataset.data,
          backgroundColor: getPieChartColors(),
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverBackgroundColor: getPieChartColors().map(color => color.replace(')', ', 0.8)').replace('rgb', 'rgba')),
          hoverBorderColor: '#ffffff',
          hoverBorderWidth: 3,
        }
      ]
    };
  };


  const chartConfig = activeChartType === 'pie' 
    ? generatePieChartConfig() 
    : generateLineChartConfig();

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          },
          color: '#333'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 10,
        bodyFont: {
          size: 13
        },
        titleFont: {
          size: 14,
          weight: 'bold' as const
        },
        usePointStyle: true,
        boxPadding: 6
      },
      title: {
        display: true,
        text: `${title} - ${activePriceType.toUpperCase()} Price`,
        font: {
          size: 18,
          weight: 'bold' as const
        },
        padding: {
          top: 10,
          bottom: 20
        },
        color: '#333'
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: true,
        },
        ticks: {
          font: {
            size: 11
          },
          color: '#666'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: `${activePriceType.charAt(0).toUpperCase() + activePriceType.slice(1)} Price`,
          font: {
            size: 12,
            weight: 'bold' as const
          },
          color: colorPalette.primary
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 11
          },
          color: '#666'
        }
      },
      y2: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Volume',
          font: {
            size: 12,
            weight: 'bold' as const
          },
          color: colorPalette.secondary
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          font: {
            size: 11
          },
          color: '#666'
        }
      },
    },
    animation: {
      duration: 1000,
    }
  };


  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          padding: 20,
          font: {
            size: 12
          },
          color: '#333'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 10,
        bodyFont: {
          size: 13
        },
        titleFont: {
          size: 14,
          weight: 'bold' as const
        },
        boxPadding: 6
      },
      title: {
        display: true,
        text: `${title} - ${activePriceType.toUpperCase()} Price Distribution`,
        font: {
          size: 18,
          weight: 'bold' as const
        },
        padding: {
          top: 10,
          bottom: 20
        },
        color: '#333'
      },
    },
    cutout: '50%',
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };


  const handleChartTypeChange = (newType: ChartType) => {
    setActiveChartType(newType);
  };


  const options = activeChartType === 'pie' ? pieChartOptions : lineChartOptions;

  const getTabStyle = (tabType: ChartType) => ({
    padding: '10px 20px',
    backgroundColor: activeChartType === tabType ? colorPalette.tabActive : colorPalette.tabInactive,
    color: activeChartType === tabType ? colorPalette.tabText : colorPalette.tabInactiveText,
    cursor: 'pointer',
    borderRadius: '4px 4px 0 0',
    marginRight: '4px',
    fontWeight: activeChartType === tabType ? 'bold' : 'normal',
    border: 'none',
    transition: 'all 0.3s ease'
  });


  const getPriceButtonStyle = (priceType: PriceType) => ({
    padding: '6px 12px',
    backgroundColor: activePriceType === priceType ? colorPalette.tabActive : 'white',
    color: activePriceType === priceType ? colorPalette.tabText : '#666',
    cursor: 'pointer',
    borderRadius: '4px',
    margin: '0 4px',
    fontWeight: activePriceType === priceType ? 'bold' : 'normal',
    border: `1px solid ${activePriceType === priceType ? colorPalette.tabActive : '#ddd'}`,
    transition: 'all 0.3s ease',
    fontSize: '12px'
  });

  return (
    <div className="w-full">
      {/* Chart Type Tabs */}
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <button 
          style={getTabStyle('line')}
          onClick={() => handleChartTypeChange('line')}
        >
          Line Chart
        </button>
        <button 
          style={getTabStyle('pie')}
          onClick={() => handleChartTypeChange('pie')}
        >
          Pie Chart
        </button>
      </div>
      
      {/* Price Type Selection */}
      <div style={{ display: 'flex', marginBottom: '16px', justifyContent: 'center' }}>
        <div style={{ fontSize: '14px', marginRight: '10px', display: 'flex', alignItems: 'center' }}>
          Price Type:
        </div>
        <button 
          style={getPriceButtonStyle('close')}
          onClick={() => setActivePriceType('close')}
        >
          Close
        </button>
        <button 
          style={getPriceButtonStyle('open')}
          onClick={() => setActivePriceType('open')}
        >
          Open
        </button>
        <button 
          style={getPriceButtonStyle('high')}
          onClick={() => setActivePriceType('high')}
        >
          High
        </button>
        <button 
          style={getPriceButtonStyle('low')}
          onClick={() => setActivePriceType('low')}
        >
          Low
        </button>
      </div>
      
      {/* Chart */}
      <div style={{ height: `${height}px` }} className="w-full">
        {data && (
          <Chart 
            key={`${activeChartType}-${activePriceType}`} 
            type={activeChartType} 
            options={options} 
            data={chartConfig} 
          />
        )}
      </div>
    </div>
  );
}