import React from 'react';
import { Eye, ShieldCheck } from 'lucide-react';

export const ReadOnlyBadge = () => {
  return (
    <div className="flex items-center space-x-2 rounded-lg border border-sky-300 bg-sky-50 px-4 py-2 text-xs font-semibold text-sky-900 shadow-sm">
      <Eye className="h-4 w-4 text-sky-700 animate-pulse" />
      <span>PARENT PORTAL: READ-ONLY ACCESS MODE</span>
      <span className="ml-auto flex items-center text-[10px] text-sky-600">
        <ShieldCheck className="h-3 w-3 mr-1" /> Verified Safe Account
      </span>
    </div>
  );
};
