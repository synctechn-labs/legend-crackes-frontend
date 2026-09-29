import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 4,
  onPageChange,
  onItemsPerPageChange
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
    <div className="bg-white rounded-2xl border-2 border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 my-6">
      {/* Items Count Summary & Per Page Selector */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-semibold text-slate-700">
        <div>
          Showing <span className="font-black text-slate-900">{startItem}</span> -{' '}
          <span className="font-black text-slate-900">{endItem}</span> of{' '}
          <span className="font-black text-red-600">{totalItems.toLocaleString()}</span> products
        </div>

        {onItemsPerPageChange && (
          <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200">
            <span className="text-slate-500 font-medium">Per page:</span>
            {[2, 4, 8, 12].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onItemsPerPageChange(size)}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${
                  itemsPerPage === size
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* First Page */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          className={`p-2.5 rounded-xl border-2 transition-all flex items-center justify-center ${
            currentPage <= 1
              ? 'border-slate-200 text-slate-400 bg-slate-100/80 cursor-not-allowed opacity-60'
              : 'border-slate-300 text-slate-800 bg-white hover:bg-red-600 hover:text-white hover:border-red-600 shadow-sm active:scale-95'
          }`}
          title="First Page"
          aria-label="First Page"
        >
          <ChevronsLeft className="w-4 h-4 stroke-[3]" />
        </button>

        {/* Previous */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`p-2.5 rounded-xl border-2 transition-all flex items-center justify-center ${
            currentPage <= 1
              ? 'border-slate-200 text-slate-400 bg-slate-100/80 cursor-not-allowed opacity-60'
              : 'border-slate-300 text-slate-800 bg-white hover:bg-red-600 hover:text-white hover:border-red-600 shadow-sm active:scale-95'
          }`}
          title="Previous Page"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4 stroke-[3]" />
        </button>

        {/* Number Buttons */}
        <div className="flex items-center gap-1.5">
          {pages.map((p, idx) => {
            if (p === 'ellipsis-left' || p === 'ellipsis-right') {
              return (
                <span key={`ellipsis-${idx}`} className="px-1 text-slate-500 font-black text-xs select-none">
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
                className={`w-9 h-9 sm:w-10 sm:h-10 text-xs sm:text-sm font-black rounded-xl transition-all flex items-center justify-center ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30 border-2 border-red-600 scale-105'
                    : 'text-slate-800 hover:bg-red-50 hover:text-red-600 hover:border-red-300 border-2 border-slate-200 bg-white'
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
          className={`p-2.5 rounded-xl border-2 transition-all flex items-center justify-center ${
            currentPage >= safeTotalPages
              ? 'border-slate-200 text-slate-400 bg-slate-100/80 cursor-not-allowed opacity-60'
              : 'border-slate-300 text-slate-800 bg-white hover:bg-red-600 hover:text-white hover:border-red-600 shadow-sm active:scale-95'
          }`}
          title="Next Page"
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </button>

        {/* Last Page */}
        <button
          type="button"
          onClick={() => onPageChange(safeTotalPages)}
          disabled={currentPage >= safeTotalPages}
          className={`p-2.5 rounded-xl border-2 transition-all flex items-center justify-center ${
            currentPage >= safeTotalPages
              ? 'border-slate-200 text-slate-400 bg-slate-100/80 cursor-not-allowed opacity-60'
              : 'border-slate-300 text-slate-800 bg-white hover:bg-red-600 hover:text-white hover:border-red-600 shadow-sm active:scale-95'
          }`}
          title="Last Page"
          aria-label="Last Page"
        >
          <ChevronsRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
