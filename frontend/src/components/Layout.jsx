'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from './ProtectedRoute';
import AdminSidebar from './AdminSidebar';
import TeacherSidebar from './TeacherSidebar';
import StudentSidebar from './StudentSidebar';
import BranchAdminSidebar from './BranchAdminSidebar';

// Sidebar mapping
const sidebarMap = {
  admin: AdminSidebar,
  teacher: TeacherSidebar,
  student: StudentSidebar,
  branchadmin: BranchAdminSidebar
};


export default function Layout({ children, role }) {
  const [finalRole, setFinalRole] = useState(null);

  useEffect(() => {
    let detectedRole = role;

    // ✅ If role not passed → get from localStorage.user
    if (!detectedRole) {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        detectedRole = user?.role;
      } catch (err) {
        console.error('Error parsing user:', err);
      }
    }

    // ✅ Normalize
    if (detectedRole) {
      detectedRole = detectedRole.toLowerCase().trim();
    }
    setFinalRole(detectedRole);
  }, [role]);

  // ⏳ Loading state
  if (!finalRole) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  const Sidebar = sidebarMap[finalRole];

  // ❌ Invalid role fallback
  if (!Sidebar) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-xl">
        Invalid role: {finalRole}
      </div>
    );
  }

  return (
    <ProtectedRoute role={finalRole}>
      <div className="min-h-screen bg-gray-100">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="pl-64 min-h-screen">
          <div className="p-6 md:p-8">
            {children}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}