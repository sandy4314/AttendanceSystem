'use client';

import ProtectedRoute from './ProtectedRoute';
import TeacherSideBar from './TeacherSidebar';


export default function TeacherLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-100">
        <TeacherSideBar/>
        <div className="flex-1 p-8 overflow-auto">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}