import { createColumnHelper } from '@tanstack/react-table'
import type { StockData } from '../types/stock';

const columnHelper = createColumnHelper<StockData>();

export const columns = [
  columnHelper.accessor('date', {
    header: 'Date',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('trade_code', {
    header: 'Trade Code',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('high', {
    header: 'High',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('low', {
    header: 'Low',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('open', {
    header: 'Open',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('close', {
    header: 'Close',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('volume', {
    header: 'Volume',
    cell: info => info.getValue().toLocaleString(),
  }),
];
