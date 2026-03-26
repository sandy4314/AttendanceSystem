'use client';

import { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { useRouter } from 'next/navigation';
import { User, Phone, BookOpen, Users } from 'lucide-react';
import Layout from '../../components/Layout';
import {useAuth} from '@/context/AuthContext';

export default function StudentDashboard() {
  const router = useRouter();
  const {user,loading:authLoading}= useAuth();
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
    if(user){
    fetchStudentData();
    }
  }, [user]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);

      const response = await apiRequest(`/students/${user.linkedId}`, {
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
          fatherName: student.parentName || 'Not provided',
          motherName: student.motherName || 'Not provided',
          parentMobile: student.parentMobile || 'N/A'
        });
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-amber-600 flex items-center space-x-2">
            <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading dashboard...</span>
          </div>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, <span className="text-amber-600">{studentData.fullName || 'Student'}</span>
          </h1>
          <p className="text-gray-600 mt-2">Here's your academic information</p>
        </div>

        {/* Student Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Student Information</h2>
                <p className="text-gray-600 mt-1">Roll No: {studentData.rollNo}</p>
              </div>
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center">
                <User className="w-7 h-7 text-amber-600" />
              </div>
            </div>

            {/* Two Column Layout for Academic and Parent Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Academic Details */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Academic Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-gray-700">
                    <BookOpen size={18} className="text-gray-400 mt-0.5 shrink-0" />
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 w-full">
                      <span className="text-gray-500 min-w-24">Branch:</span>
                      <span className="font-medium text-gray-900">{studentData.branch}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 text-gray-700">
                    <Users size={18} className="text-gray-400 mt-0.5 shrink-0" />
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 w-full">
                      <span className="text-gray-500 min-w-24">Class:</span>
                      <span className="font-medium text-gray-900">{studentData.classRef}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 text-gray-700">
                    <Users size={18} className="text-gray-400 mt-0.5 shrink-0" />
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 w-full">
                      <span className="text-gray-500 min-w-24">Section:</span>
                      <span className="font-medium text-gray-900">{studentData.section}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Parent/Guardian Details */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Parent/Guardian Details</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-gray-700">
                    <User size={18} className="text-gray-400 mt-0.5 shrink-0" />
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 w-full">
                      <span className="text-gray-500 min-w-28">Father's Name:</span>
                      <span className="font-medium text-gray-900">{studentData.fatherName}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 text-gray-700">
                    <User size={18} className="text-gray-400 mt-0.5 shrink-0" />
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 w-full">
                      <span className="text-gray-500 min-w-28">Mother's Name:</span>
                      <span className="font-medium text-gray-900">{studentData.motherName}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 text-gray-700">
                    <Phone size={18} className="text-gray-400 mt-0.5 shrink-0" />
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 w-full">
                      <span className="text-gray-500 min-w-28">Parent's Mobile:</span>
                      <span className="font-medium text-gray-900">{studentData.parentMobile}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>      
      </div>
    </Layout>
  );
}