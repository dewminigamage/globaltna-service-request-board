import Link from 'next/link';
import StatusBadge from './StatusBadge';

const topBar = {
  Open: 'bg-emerald-500',
  'In Progress': 'bg-amber-400',
  Closed: 'bg-slate-300',
};

const categoryIcons = {
  Plumbing:   '🔧',
  Electrical: '⚡',
  Painting:   '🖌️',
  Joinery:    '🪵',
  Other:      '🔩',
};

export default function JobCard({ job }) {
  return (
    <Link href={`/jobs/${job._id}`} className="group block h-full">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all h-full flex flex-col overflow-hidden">
        {/* Top colour bar */}
        <div className={`h-1 w-full ${topBar[job.status] ?? 'bg-slate-200'}`} />

        <div className="p-5 flex flex-col flex-1">
          {/* Category + Status row */}
          <div className="flex items-center justify-between mb-3">
            {job.category ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                <span>{categoryIcons[job.category] ?? '🔩'}</span>
                {job.category}
              </span>
            ) : <span />}
            <StatusBadge status={job.status} />
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors">
            {job.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-slate-500 line-clamp-2 flex-1 leading-relaxed">
            {job.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400">
            {job.location ? (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.location}
              </span>
            ) : <span />}
            <span>
              {new Date(job.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
