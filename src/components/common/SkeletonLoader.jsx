import React from 'react';

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs animate-pulse flex flex-col h-full">
    <div className="w-full h-52 bg-slate-200" />
    <div className="p-4 flex flex-col flex-1 gap-2.5">
      <div className="flex justify-between items-center">
        <div className="h-4 bg-slate-200 rounded-md w-24" />
        <div className="h-4 bg-slate-200 rounded-md w-16" />
      </div>
      <div className="h-5 bg-slate-200 rounded-md w-4/5" />
      <div className="h-4 bg-slate-200 rounded-md w-1/2" />
      <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="space-y-1">
          <div className="h-3 bg-slate-200 rounded-md w-14" />
          <div className="h-6 bg-slate-200 rounded-md w-20" />
        </div>
        <div className="h-9 bg-slate-200 rounded-lg w-28" />
      </div>
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const TableRowSkeleton = ({ columns = 6 }) => (
  <tr className="animate-pulse border-b border-slate-100">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="py-4 px-4">
        <div className="h-4 bg-slate-200 rounded-md w-full" />
      </td>
    ))}
  </tr>
);
