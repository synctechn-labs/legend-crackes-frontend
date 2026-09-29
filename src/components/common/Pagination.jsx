import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 12,
  onPageChange,
}) => {
  const safeTotalPages = Math.max(1, totalPages);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers with smart ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const delta = 1; // pages around current

    const left = Math.max(1, currentPage - delta);
    const right = Math.min(safeTotalPages, currentPage + delta);

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (left > 2) {
      pages.unshift('ellipsis-left');
      pages.unshift(1);
    } else if (left === 2) {
      pages.unshift(1);
    }

    if (right < safeTotalPages - 1) {
      pages.push('ellipsis-right');
      pages.push(safeTotalPages);
    } else if (right === safeTotalPages - 1) {
      pages.push(safeTotalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 my-6">
      {/* Items Count Summary */}
      <div className="text-xs font-semibold text-slate-600 text-center sm:text-left">
        Showing <span className="font-extrabold text-slate-900">{startItem}</span> -{' '}
        <span className="font-extrabold text-slate-900">{endItem}</span> of{' '}
        <span className="font-extrabold text-red-600">{totalItems.toLocaleString()}</span> products
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* First Page */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          className={`p-2 rounded-xl border transition-all ${
            currentPage <= 1
              ? 'border-slate-200 text-slate-300 bg-slate-50/80 cursor-not-allowed'
              : 'border-slate-200 text-slate-700 hover:text-red-600 hover:bg-red-50 hover:border-red-200 shadow-xs'
          }`}
          title="First Page"
        >
          <ChevronsLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Previous */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`p-2 rounded-xl border transition-all ${
            currentPage <= 1
              ? 'border-slate-200 text-slate-300 bg-slate-50/80 cursor-not-allowed'
              : 'border-slate-200 text-slate-700 hover:text-red-600 hover:bg-red-50 hover:border-red-200 shadow-xs'
          }`}
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Number Buttons */}
        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === 'ellipsis-left' || p === 'ellipsis-right') {
              return (
                <span key={`ellipsis-${idx}`} className="px-1 text-slate-400 text-xs font-bold select-none">
                  …
                </span>
              );
            }

            const isActive = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 sm:w-9 sm:h-9 text-xs sm:text-sm font-black rounded-xl transition-all ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md shadow-red-500/20 ring-2 ring-red-600 ring-offset-1'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-red-600 border border-slate-200'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= safeTotalPages}
          className={`p-2 rounded-xl border transition-all ${
            currentPage >= safeTotalPages
              ? 'border-slate-200 text-slate-300 bg-slate-50/80 cursor-not-allowed'
              : 'border-slate-200 text-slate-700 hover:text-red-600 hover:bg-red-50 hover:border-red-200 shadow-xs'
          }`}
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Last Page */}
        <button
          type="button"
          onClick={() => onPageChange(safeTotalPages)}
          disabled={currentPage >= safeTotalPages}
          className={`p-2 rounded-xl border transition-all ${
            currentPage >= safeTotalPages
              ? 'border-slate-200 text-slate-300 bg-slate-50/80 cursor-not-allowed'
              : 'border-slate-200 text-slate-700 hover:text-red-600 hover:bg-red-50 hover:border-red-200 shadow-xs'
          }`}
          title="Last Page"
        >
          <ChevronsRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
