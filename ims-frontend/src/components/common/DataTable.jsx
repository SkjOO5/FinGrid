import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { statusColor } from '../../utils/helpers';

const DataTable = ({ title, columns, data, onAdd, addLabel, searchFields = [], renderRow, emptyText = 'No data found.', pageSize = 8 }) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = data.filter(row => {
    if (!search) return true;
    return searchFields.some(field => String(row[field] || '').toLowerCase().includes(search.toLowerCase()));
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const sliced = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="glass-panel rounded-2xl border border-border overflow-hidden">
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 border-b border-border">
        {title && <h3 className="text-base font-bold text-textPrimary">{title}</h3>}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {searchFields.length > 0 && (
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          )}
          {onAdd && (
            <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 active:scale-95 transition-all shrink-0">
              <Plus className="h-4 w-4" />
              {addLabel || 'Add'}
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-hover/50">
              {columns.map(col => (
                <th key={col.key} className="text-left px-5 py-3 font-semibold text-textSecondary text-xs uppercase tracking-wider whitespace-nowrap">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sliced.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-16 text-textSecondary">
                  <p className="text-base font-medium">{emptyText}</p>
                  {onAdd && <button onClick={onAdd} className="mt-2 text-primary text-sm underline">{addLabel || 'Add one now'}</button>}
                </td>
              </tr>
            ) : renderRow ? sliced.map((row, i) => renderRow(row, i)) : sliced.map((row, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-surface-hover/30 transition-colors">
                {columns.map(col => <td key={col.key} className="px-5 py-3.5 text-textPrimary">{row[col.key]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-border text-sm">
          <span className="text-textSecondary">{filtered.length} results · Page {page} of {totalPages}</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg border border-border hover:border-primary text-textSecondary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg border border-border hover:border-primary text-textSecondary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const StatusBadge = ({ status }) => (
  <span className={`inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${statusColor(status)}`}>
    {status}
  </span>
);

export default DataTable;
