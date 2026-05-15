'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { fetchJob, updateJobStatus, deleteJob } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import StatusBadge from '@/components/StatusBadge';
import Link from 'next/link';

const STATUSES = ['Open', 'In Progress', 'Closed'];

const categoryIcons = {
  Plumbing: '🔧', Electrical: '⚡', Painting: '🖌️', Joinery: '🪵', Other: '🔩',
};

export default function JobDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchJob(id);
        setJob(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleStatusChange(e) {
    const newStatus = e.target.value;
    setUpdating(true);
    try {
      const updated = await updateJobStatus(job._id, newStatus);
      setJob(updated);
    } catch (err) {
      alert(`Could not update status: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this service request? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await deleteJob(job._id);
      router.push('/');
    } catch (err) {
      alert(`Could not delete: ${err.message}`);
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-24">
        <p className="text-red-500 text-sm mb-4">{error}</p>
        <Link href="/" className="text-blue-600 text-sm hover:underline">&larr; Back to listings</Link>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back link */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to listings
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="text-xl font-bold text-slate-900 leading-snug">{job.title}</h1>
            <StatusBadge status={job.status} />
          </div>
          {job.category && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
              <span>{categoryIcons[job.category] ?? '🔩'}</span>
              {job.category}
            </span>
          )}
        </div>

        {/* Description */}
        <div className="p-6 border-b border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Description</p>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
        </div>

        {/* Details grid */}
        <div className="p-6 border-b border-slate-100 grid grid-cols-2 gap-5 text-sm">
          {job.location && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Location</p>
              <p className="text-slate-800 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.location}
              </p>
            </div>
          )}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Posted</p>
            <p className="text-slate-800">
              {new Date(job.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </p>
          </div>
          {job.contactName && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Contact</p>
              <p className="text-slate-800">{job.contactName}</p>
            </div>
          )}
          {job.contactEmail && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Email</p>
              <a href={`mailto:${job.contactEmail}`} className="text-blue-600 hover:underline break-all">
                {job.contactEmail}
              </a>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-slate-50 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-slate-600">Update Status:</label>
            <select
              value={job.status}
              onChange={handleStatusChange}
              disabled={updating}
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 shadow-sm"
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {updating && (
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <div className="w-3 h-3 border border-slate-400 border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            )}
          </div>

          {user ? (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 font-medium disabled:opacity-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {deleting ? 'Deleting...' : 'Delete Request'}
            </button>
          ) : (
            <Link href="/login" className="text-sm text-slate-400 hover:text-blue-600 transition-colors">
              Sign in to delete
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
