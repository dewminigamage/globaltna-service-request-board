const config = {
  Open:         { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50 ring-emerald-200' },
  'In Progress':{ dot: 'bg-amber-500',   text: 'text-amber-700',   bg: 'bg-amber-50 ring-amber-200'   },
  Closed:       { dot: 'bg-slate-400',   text: 'text-slate-500',   bg: 'bg-slate-100 ring-slate-200'  },
};

export default function StatusBadge({ status }) {
  const c = config[status] ?? config.Closed;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
      {status}
    </span>
  );
}
