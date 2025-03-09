import { useState } from 'react';
import { 
  flexRender,
  getCoreRowModel,
  useReactTable, 
  SortingState,
  getSortedRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';
import type { StockData } from '../types/stock';
import { ChevronLeft, ChevronRight, Save, X, Edit, ArrowUpDown } from 'lucide-react';
import { columns } from '../helpers/ColumnHelper';

interface StockTableProps {
  data: StockData[];
  onEdit: (row: StockData) => void;
}

export function StockTable({ data, onEdit }: StockTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<Partial<StockData>>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  });

  const handleEditClick = (row: StockData) => {
    setEditingRow(row.id);
    setEditedValues({ ...row });
  };

  const handleSaveClick = (row: StockData) => {
    onEdit({ ...row, ...editedValues });
    setEditingRow(null);
  };

  const handleCancelClick = () => {
    setEditingRow(null);
    setEditedValues({});
  };

  const handleInputChange = (field: keyof StockData, value: string) => {
    setEditedValues(prev => ({
      ...prev,
      [field]: parseFloat(value)
    }));
  };

  return (
    <div className="rounded-lg overflow-hidden bg-white shadow-xl border border-gray-100">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-blue-600 to-purple-600">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-6 py-4 text-left text-sm font-semibold text-white/90 hover:text-white transition-colors cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center space-x-2 group">
                    <span className="tracking-wide">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </span>
                    <ArrowUpDown className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Actions</th>
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200/80">
          {table.getRowModel().rows.map(row => (
            <tr 
              key={row.id} 
              className="hover:bg-gray-50/80 transition-colors even:bg-gray-50/30"
            >
              {row.getVisibleCells().map(cell => {
                const isEditable = ['high', 'low', 'open', 'close', 'volume'].includes(cell.column.id);
                const isEditing = editingRow === row.original.id && isEditable;
                
                return (
                  <td
                    key={cell.id}
                    className="px-6 py-4 text-sm text-gray-700"
                  >
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedValues[cell.column.id as keyof StockData] ?? ''}
                        onChange={(e) => handleInputChange(cell.column.id as keyof StockData, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        step="0.01"
                        min="0"
                      />
                    ) : (
                      <div className={`${cell.column.id === 'symbol' ? 'font-medium text-blue-600' : ''}`}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    )}
                  </td>
                );
              })}
              <td className="px-6 py-4">
                {editingRow === row.original.id ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSaveClick(row.original)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                    >
                      <Save className="h-4 w-4" />
                      <span className="hidden sm:inline">Save</span>
                    </button>
                    <button
                      onClick={handleCancelClick}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      <span className="hidden sm:inline">Cancel</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditClick(row.original)}
                    className="bg-gray-800/90 hover:bg-gray-900 text-white px-3 py-1.5 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200/80 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white transition-colors shadow-sm"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <span className="text-sm font-medium text-gray-700">
            Page <span className="font-semibold">{table.getState().pagination.pageIndex + 1}</span> of{' '}
            <span className="font-semibold">{table.getPageCount()}</span>
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white transition-colors shadow-sm"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </div>
        <div className="text-sm text-gray-600 font-medium">
          Showing{' '}
          <span className="text-blue-600 font-semibold">{table.getRowModel().rows.length}</span>{' '}
          of{' '}
          <span className="text-blue-600 font-semibold">{data.length}</span>{' '}
          records
        </div>
      </div>
    </div>
  );
}