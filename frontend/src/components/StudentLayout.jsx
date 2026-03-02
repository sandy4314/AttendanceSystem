'use client';
import ProtectedRoute from './ProtectedRoute';
import StudentSidebar from './StudentSidebar';

export default function StudentLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-100">
        <StudentSidebar />
        <div className="flex-1 p-8 overflow-auto">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}