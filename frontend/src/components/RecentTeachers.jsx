'use client';

import Link from 'next/link';

export default function RecentTeachers({ data, total }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Teachers</h3>

      {data.length > 0 ? (
        <div className="space-y-3">
          {data.map((teacher, idx) => (
            <div key={teacher._id || idx} className="flex items-center justify-between border-b pb-2 last:border-0">
              <div>
                <p className="font-medium text-gray-900">{teacher.fullName || teacher.name}</p>
                <p className="text-sm text-gray-500">
                  {teacher.phone || teacher.email || 'No contact'}
                </p>
              </div>

              <span className="text-xs text-gray-500">
                {teacher.salary ? `₹${teacher.salary.toLocaleString()}` : 'N/A'}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No teachers found</p>
      )}

      <Link href="/admin-dashboard/teachers" className="mt-4 inline-flex items-center text-amber-500 hover:text-amber-600">
        View All ({total}) →
      </Link>
    </div>
  );
}