'use client';

import Link from 'next/link';

export default function RecentBranches({ data, total }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Branches</h3>

      {data.length > 0 ? (
        <div className="space-y-3">
          {data.map((branch, idx) => (
            <div key={branch._id || idx} className="flex items-center justify-between border-b pb-2 last:border-0">
              <div>
                <p className="font-medium text-gray-900">{branch.branchName}</p>
                <p className="text-sm text-gray-500">{branch.schoolName || 'N/A'}</p>
              </div>

              <span className={`text-xs px-2 py-1 rounded-full ${
                branch.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {branch.status || 'active'}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No branches found</p>
      )}

      <Link href="/admin-dashboard/branches" className="mt-4 inline-flex items-center text-amber-500 hover:text-amber-600">
        View All ({total}) →
      </Link>
    </div>
  );
}