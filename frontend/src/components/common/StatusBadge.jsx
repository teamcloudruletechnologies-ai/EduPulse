import React from 'react';

export const StatusBadge = ({ status }) => {
  if (!status) return null;
  const normalized = String(status).toUpperCase();

  let style = 'bg-slate-100 text-slate-800 border-slate-300';
  if (['COMPLETED', 'APPROVED', 'HEALTHY', 'ACTIVE'].includes(normalized)) {
    style = 'bg-emerald-50 text-emerald-700 border-emerald-300';
  } else if (['IN_PROGRESS', 'PENDING_REVIEW', 'ON_TRACK', 'ANALYZING'].includes(normalized)) {
    style = 'bg-amber-50 text-amber-700 border-amber-300';
  } else if (['REVISION_REQUIRED', 'BEHIND_SCHEDULE', 'REJECTED'].includes(normalized)) {
    style = 'bg-rose-50 text-rose-700 border-rose-300';
  } else if (['DRAFT', 'PENDING'].includes(normalized)) {
    style = 'bg-slate-100 text-slate-700 border-slate-300';
  }

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${style}`}>
      {String(status).replace(/_/g, ' ')}
    </span>
  );
};
