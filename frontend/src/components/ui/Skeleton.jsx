import React from 'react';

export const Skeleton = ({ className = '' }) => {
  return <div className={`bg-slate-200 animate-pulse rounded-md ${className}`} />;
};

export const CardSkeleton = () => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
    <Skeleton className="h-4 w-1/3" />
    <Skeleton className="h-8 w-1/2" />
    <Skeleton className="h-3 w-2/3" />
  </div>
);

export const TableSkeleton = ({ rows = 4 }) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-4 space-y-3">
    <Skeleton className="h-10 w-full" />
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} className="h-12 w-full" />
    ))}
  </div>
);
