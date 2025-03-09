export interface StockData {
    id: string;
    date: string;
    trade_code: string;
    high: number;
    low: number;
    open: number;
    close: number;
    volume: number;
  }
  
  export interface ChartData {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
      yAxisID?: string;
    }[];
  }