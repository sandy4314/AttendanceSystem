'use client';

import ProtectedRoute from './ProtectedRoute';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 p-8 overflow-auto">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}