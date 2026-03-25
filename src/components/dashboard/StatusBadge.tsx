'use client';

import { cn } from '@/lib/utils';

type Status = 'pending' | 'approved' | 'rejected' | 'shortlisted' | 'accepted';

const statusStyles: Record<Status, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400 border border-yellow-400/30',
  approved: 'bg-green-500/10 text-green-400 border border-green-400/30',
  rejected: 'bg-red-500/10 text-red-400 border border-red-400/30',
  shortlisted: 'bg-blue-500/10 text-blue-400 border border-blue-400/30',
  accepted: 'bg-emerald-500/10 text-emerald-400 border border-emerald-400/30',
};

export default function StatusBadge({ status }: { status: Status }) {
  const style = statusStyles[status] || statusStyles.pending;

  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={cn(
      "inline-flex items-center px-5 py-2 rounded-2xl text-sm font-semibold tracking-wide",
      style
    )}>
      {label}
    </span>
  );
}