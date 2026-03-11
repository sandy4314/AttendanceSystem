'use client';
import DashBox from "@/components/DashBox"
import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { Building, BookOpen, Layers, Users, GraduationCap, RefreshCw } from 'lucide-react';

export default function BranchDashboard() {
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [branchInfo, setBranchInfo] = useState(null);
  const [user, setUser] = useState(null);

  const [stats, setStats] = useState({
    totalClasses: 0,
    totalSections: 0,
    totalStudents: 0,
    totalTeachers: 0,
  });

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        console.log('Branch Admin User:', userData);
        setUser(userData);
      }
    } catch (err) {
      console.error('Error parsing user:', err);
      setError('Failed to load user data');
    }
  }, []);
  
  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      if (!user) {
        throw new Error('User not found. Please login again.');
      }

      const branchId = user.linkedId;
      console.log('Branch ID:', branchId);

      if (!branchId) {
        throw new Error('Branch information not found');
      }

      try {
        const branchRes = await apiRequest(`/branches/${branchId}`);
        console.log('Branch Response:', branchRes);
        
        if (branchRes.success) {
          setBranchInfo(branchRes.data);

          setStats({
            totalClasses: branchRes.data.totalClasses || 0,
            totalSections: branchRes.data.totalSections || 0,
            totalStudents: branchRes.data.totalStudents || 0,
            totalTeachers: branchRes.data.totalTeachers || 0,
          });
        }
      } catch (err) {
        console.error('Error fetching branch info:', err);
        
        setStats({
          totalClasses: 0,
          totalSections: 0,
          totalStudents: 0,
          totalTeachers: 0,
        });
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

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-700">Loading dashboard...</span>
            </div>
            <p className="text-sm text-gray-500">Fetching your branch data</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Branch Dashboard</h2>
          <p className="text-gray-700">Welcome back, {user?.username || 'Branch Admin'}!</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
        >
          <RefreshCw size={18} /> Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <DashBox 
          title="Total Classes"
          value={stats.totalClasses}
          color="border-blue-500"
          icon={<BookOpen className="text-blue-500" size={24} />}
        />
        <DashBox 
          title="Total Sections"
          value={stats.totalSections}
          color="border-green-500"
          icon={<Layers className="text-green-500" size={24} />}
        />
        <DashBox 
          title="Total Students"
          value={stats.totalStudents}
          color="border-purple-500"
          icon={<GraduationCap className="text-purple-500" size={24} />}
        />
        <DashBox 
          title="Total Teachers"
          value={stats.totalTeachers}
          color="border-orange-500"
          icon={<Users className="text-orange-500" size={24} />}
        />
      </div>
    </Layout>
  );
}