'use client';

import ProtectedRoute from './ProtectedRoute';
import AdminSidebar from './AdminSidebar';
import TeacherSidebar from './TeacherSidebar';
import StudentSidebar from './StudentSidebar';
import BranchAdminSidebar from './BranchAdminSidebar';
import { useAuth } from '@/context/AuthContext'; // 🔥 use context

const sidebarMap = {
  admin: AdminSidebar,
  teacher: TeacherSidebar,
  student: StudentSidebar,
  branchadmin: BranchAdminSidebar
};

export default function Layout({ children }) {
  const { user, loading } = useAuth(); // ✅ single source of truth

  // ⏳ Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // ❌ Unauthorized
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Unauthorized
      </div>
    );
  }

  const role = user.role?.toLowerCase().trim();
  const Sidebar = sidebarMap[role];

  // ❌ Invalid role
  if (!Sidebar) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-xl">
        Invalid role: {role}
      </div>
    );
  }

  return (
    <ProtectedRoute role={role}>
      <div className="min-h-screen bg-gray-100">

        <Sidebar />

        <div className="pl-64 min-h-screen">
          <div className="p-6 md:p-8">
            {children}
          </div>
        </div>

      </div>
    </ProtectedRoute>
  );
}