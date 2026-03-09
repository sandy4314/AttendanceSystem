
'use client';

import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { apiRequest } from "@/services/api";
import {Building,BookOpen,Layers,Users,GraduationCap,Grid,RefreshCw} from 'lucide-react';
import Pagination from '@/components/Pagination';

export default function MyAssigns(){

  
  const [userid,setUserId]=useState('');
  const [teacherdata,setTeacherData]=useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page,setPage]=useState(1);
  const [totalPages,setTotalPages]=useState(1);
  const limit=5;
  // const router=useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user?.linkedId);
    setUserId(user.linkedId);
    
    }, []);

    
    useEffect(()=>{

        if(userid){
            fetchDashboardData();
        }

    },[userid,page]);

    const handleRefresh = () => {
    fetchDashboardData();
  };


    const fetchDashboardData=async()=>{

      try
      {

      const teacherRes = await apiRequest(`/assignsubject/teacher/${userid}?/&page=${page}&limit=${limit}`);
      let teacherArray = [];
        

      if (teacherRes?.success && Array.isArray(teacherRes.data)) {
            teacherArray = teacherRes.data;
            setTeacherData(teacherArray);
            setTotalPages(teacherRes.totalPages || 1);
      }

    }catch (err) {
      console.error('Dashboard error:', err);
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }

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
  
  return (<div>
  <Layout>
    <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Assignments</h2>
          
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
        >
          <RefreshCw size={18} /> Refresh
        </button>
      </div>
    <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>

                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {teacherdata.length > 0 ? (
                  teacherdata.map((assignment, index) => (
                    <tr key={assignment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{(page - 1) * 5 + index + 1}</td>
                     
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <BookOpen size={16} className="text-gray-500" />
                          {assignment.subject.subjectName}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <Building size={16} className="text-gray-500" />
                          {assignment.branch.branchName}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{assignment.classRef.className}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{assignment.section.sectionName}</td>
                      
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      {teacherdata
                        ? 'No assignments match your search criteria.'
                        : 'No assignments found. Click "Assign Subject" to create one.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div>
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </div>
</Layout>
    </div>)
}