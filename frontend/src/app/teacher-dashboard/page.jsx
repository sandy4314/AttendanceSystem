'use client'

import Layout from "@/components/Layout"

// import DashBox from "@/components/DashBox"
import dynamic from "next/dynamic";
const DashboardStats = dynamic(() => import("@/components/DashboardStats"), {
  loading: () => <p>Loading stats...</p>,
});


import { useRouter } from "next/navigation";
import { Building, BookOpen, Layers, RefreshCw } from 'lucide-react';
import { useState, useEffect, use } from "react";
import { apiRequest } from "@/services/api";
import { useAuth } from '@/context/AuthContext';

export default function TeacherDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [teacherdata, setTeacherData] = useState([]);
  const [sectionincharging, setSectionIncharging] = useState([]);
  const router = useRouter();

  const [stats, setStats] = useState({
    totalClasses: 0,
    totalSubjects: 0,
    totalsectionsInchage: 0
  });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user])

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const teacherRes = await apiRequest(`/assignsubject/teacher/${user?.linkedId}`);
      let teacherArray = [];
      if (teacherRes?.success && Array.isArray(teacherRes.data)) {
        teacherArray = teacherRes.data;
        setTeacherData(teacherArray);

        const uniqueSubjects = new Map(teacherArray.map(item => [item.subject._id, item.subject.subjectName]))
        console.log("uniq", uniqueSubjects);
        setStats(prev => ({
          ...prev,
          totalClasses: teacherArray.length,
          totalSubjects: uniqueSubjects.size
        }));
      }

      const sectionRes = await apiRequest('/sections/my-incharge');
      let sectionArray = [];
      if (sectionRes?.success && Array.isArray(sectionRes.data)) {
        sectionArray = sectionRes.data;
        setSectionIncharging(sectionArray);
      }

      setStats(prev => ({
        ...prev,
        totalClasses: teacherArray.length,
        totalsectionsInchage: sectionArray.length
      }));

    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };
  const teacherStatsArray = [
    {
      title: "Total Classes",
      value: stats.totalClasses,
      icon: <Building className="text-amber-500" size={24} />,
      color: "border-amber-500"
    },
    {
      title: "Total Subjects",
      value: stats.totalSubjects,
      icon: <BookOpen className="text-blue-500" size={24} />,
      color: "border-blue-500"
    },
    {
      title: "Total Sections Incharge",
      value: stats.totalsectionsInchage,
      icon: <Layers className="text-green-500" size={24} />,
      color: "border-green-500"
    }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-700">Loading dashboard...</span>
            </div>
            <p className="text-sm text-gray-500">Fetching your data</p>
          </div>
        </div>
      </Layout>
    );
  }
  if (error) {
    return (
      <Layout>
        <div className="text-center text-red-500 mt-10">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
       {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-700">Welcome, back  {user?.username}!</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
        >
          <RefreshCw size={18} /> Refresh
        </button>
      </div>
      
      {/* ✅ LAZY LOADED STATS */}
      <DashboardStats stats={teacherStatsArray} />
    </Layout>
  )
}