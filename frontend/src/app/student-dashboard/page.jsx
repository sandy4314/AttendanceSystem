'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { useRouter } from 'next/navigation';
import { GraduationCap, BookOpen, User, Phone, MapPin,LogOut,Award,Users} from 'lucide-react';

export default function StudentDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState({
    fullName: '',
    rollNo: '',
    branch: '',
    classRef: '',
    section: '',
    fatherName: '',
    motherName: '',
    parentMobile: ''
  });

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => { 
  try {
    setLoading(true);
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const response = await apiRequest('/students/profile', {
      method: 'GET'
    });
    if (response && response.data) {
      const student = response.data;
      setStudentData({
        fullName: student.fullName || storedUser.name || '',
        rollNo: student.rollNo || 'N/A',
        branch: student.branch?.branchName || 'N/A',
        classRef: student.classRef?.className || 'N/A',
        section: student.section?.sectionName || 'N/A',
        fatherName: student.parentName || 'Parent Name',
        motherName: student.motherName || 'Mother Name',
        parentMobile: student.parentMobile || 'N/A'
      });
    }
  } catch (error) {
    console.error('Error fetching student data:', error);
  } finally {
    setLoading(false);
  }
};
  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };
  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-amber-50 flex items-center justify-center">
          <div className="text-amber-600 flex items-center space-x-2">
            <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading dashboard...</span>
          </div>
        </div>
      </ProtectedRoute>
    );
  }
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-linear-to-r from-amber-600 to-amber-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-6 h-6" />
                <span className="font-semibold text-lg">SL</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition text-sm"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Welcome, <span className="text-amber-600">{studentData.fullName || 'Student'}</span>
            </h2>
          </div>

          {/* Student Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{studentData.fullName || 'Student Name'}</h3>
                  <p className="text-gray-600">Roll No: {studentData.rollNo}</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-amber-600" />
                </div>
              </div>

              {/* Two Column Layout for Academic and Parent Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Academic Details */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Academic Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-gray-700">
                      <BookOpen size={16} className="text-gray-400" />
                      <span className="w-24 text-gray-500">Branch:</span>
                      <span className="font-medium">{studentData.branch}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-700">
                      <Users size={16} className="text-gray-400" />
                      <span className="w-24 text-gray-500">Class:</span>
                      <span className="font-medium">{studentData.classRef}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-700">
                      <Users size={16} className="text-gray-400" />
                      <span className="w-24 text-gray-500">Section:</span>
                      <span className="font-medium">{studentData.section}</span>
                    </div>
                  </div>
                </div>

                {/* Parent/Guardian Details */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Parent/Guardian Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-gray-700">
                      <User size={16} className="text-gray-400" />
                      <span className="w-28 text-gray-500">Father's Name:</span>
                      <span className="font-medium">{studentData.fatherName}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-700">
                      <User size={16} className="text-gray-400" />
                      <span className="w-28 text-gray-500">Mother's Name:</span>
                      <span className="font-medium">{studentData.motherName}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Phone size={16} className="text-gray-400" />
                      <span className="w-28 text-gray-500">Parent's Mobile:</span>
                      <span className="font-medium">{studentData.parentMobile}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}