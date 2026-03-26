'use client';
import Layout from '../../components/Layout';
import dynamic from "next/dynamic";
const DashboardStats = dynamic(() => import("@/components/DashboardStats"), {
  loading: () => <p>Loading stats...</p>,
});


import { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building, BookOpen, Layers, Users, GraduationCap, Grid, RefreshCw, BookMarked } from 'lucide-react';
import {useAuth} from '@/context/AuthContext';

export default function AdminDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState({
    totalBranches: 0,
    totalClasses: 0,
    totalSections: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalSubjects: 0
  });

  const [recentBranches, setRecentBranches] = useState([]);
  const [recentTeachers, setRecentTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user, loading:authLoading } = useAuth();
  
  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');


      // Fetch all data in parallel for better performance
      const [branchesRes, teachersRes, studentsRes, classesRes, sectionsRes, subjectsRes] = await Promise.allSettled([
        apiRequest('/branches/all'),
        apiRequest('/teachers/all'),
        apiRequest('/students/all'),
        apiRequest('/classes/all'),
        apiRequest('/sections/all'),
        apiRequest('/subjects/all')
      ]);

       

      // Process Branches
      if (branchesRes.status === 'fulfilled' && branchesRes.value) {
        const branchesData = branchesRes.value;
        let branches = [];
        if (branchesData.success && Array.isArray(branchesData.data)) {
          branches = branchesData.data;
        } else if (Array.isArray(branchesData)) {
          branches = branchesData;
        }

        setRecentBranches(branches.slice(0, 2));
        setStats(prev => ({...prev,totalBranches: branches.length}));
      }

      // Process Teachers
      if (teachersRes.status === 'fulfilled' && teachersRes.value) {
        const teachersData = teachersRes.value;
        let teachers = [];

        if (teachersData.success && Array.isArray(teachersData.data)) {
          teachers = teachersData.data;
        } else if (Array.isArray(teachersData)) {
          teachers = teachersData;
        }

        setRecentTeachers(teachers.slice(0, 2));
        setStats(prev => ({ ...prev, totalTeachers: teachers.length }));
      }

      // Process Students
      if (studentsRes.status === 'fulfilled' && studentsRes.value) {
        const studentsData = studentsRes.value;
        let students = [];

        if (studentsData.success && Array.isArray(studentsData.data)) {
          students = studentsData.data;
        } else if (Array.isArray(studentsData)) {
          students = studentsData;
        }

        setStats(prev => ({ ...prev, totalStudents: students.length }));
      }

      // Process Classes
      if (classesRes.status === 'fulfilled' && classesRes.value) {
        const classesData = classesRes.value;
        let classes = [];

        if (classesData.success && Array.isArray(classesData.data)) {
          classes = classesData.data;
        } else if (Array.isArray(classesData)) {
          classes = classesData;
        }

        setStats(prev => ({ ...prev, totalClasses: classes.length }));
      }

      // Process Sections
      if (sectionsRes.status === 'fulfilled' && sectionsRes.value) {
        const sectionsData = sectionsRes.value;
        let sections = [];

        if (sectionsData.success && Array.isArray(sectionsData.data)) {
          sections = sectionsData.data;
        } else if (Array.isArray(sectionsData)) {
          sections = sectionsData;
        }

        setStats(prev => ({ ...prev, totalSections: sections.length }));
      }

      // Process Subjects
      if (subjectsRes.status === 'fulfilled' && subjectsRes.value) {  
        const subjectsData = subjectsRes.value;  
        let subjectsList = [];

        if (subjectsData.success && Array.isArray(subjectsData.data)) {
          subjectsList = subjectsData.data;
        } else if (Array.isArray(subjectsData)) {
          subjectsList = subjectsData;
        }

        setStats(prev => ({ ...prev, totalSubjects: subjectsList.length })); 
      }
    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };
  const adminStatsArray = [
    {
      title: "Total Branches",
      value: stats.totalBranches,
      icon: <Building className="text-amber-500" size={24} />,
      color: "border-amber-500"
    },
    {
      title: "Total Classes",
      value: stats.totalClasses,
      icon: <BookOpen className="text-blue-500" size={24} />,
      color: "border-blue-500"
    },
    {
      title: "Total Sections",
      value: stats.totalSections,
      icon: <Layers className="text-green-500" size={24} />,
      color: "border-green-500"
    },
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: <GraduationCap className="text-purple-500" size={24} />,
      color: "border-purple-500"
    },
    {
      title: "Total Teachers",
      value: stats.totalTeachers,
      icon: <Users className="text-orange-500" size={24} />,
      color: "border-orange-500"
    },
    {
      title: "Total Subjects",
      value: stats.totalSubjects,
      icon: <BookMarked className="text-indigo-500" size={24} />,
      color: "border-indigo-500"
    }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading dashboard...</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-700">Welcome back, Admin!</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
        >
          <RefreshCw size={18} /> Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* ✅ LAZY LOADED STATS */}
      <DashboardStats stats={adminStatsArray} />

      {/* RECENT ACTIVITY SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Branches */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Branches</h3>
          {recentBranches.length > 0 ? (
            <div className="space-y-3">
              {recentBranches.map((branch, idx) => (
                <div key={branch._id || idx} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{branch.branchName}</p>
                    <p className="text-sm text-gray-500">{branch.schoolName || 'N/A'}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${branch.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                    {branch.status || 'active'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No branches found</p>
          )}
          <Link
            href="/admin-dashboard/branches"
            className="mt-4 inline-flex items-center text-amber-500 hover:text-amber-600"
          >
            View All ({stats.totalBranches}) →
          </Link>
        </div>

        {/* Recent Teachers */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Teachers</h3>
          {recentTeachers.length > 0 ? (
            <div className="space-y-3">
              {recentTeachers.map((teacher, idx) => (
                <div key={teacher._id || idx} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{teacher.fullName || teacher.name}</p>
                    <p className="text-sm text-gray-500">{teacher.phone || teacher.email || 'No contact'}</p>
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
          <Link
            href="/admin-dashboard/teachers"
            className="mt-4 inline-flex items-center text-amber-500 hover:text-amber-600"
          >
            View All ({stats.totalTeachers}) →
          </Link>
        </div>
      </div>
    </Layout>
  );
}

