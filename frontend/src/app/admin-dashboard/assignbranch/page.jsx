'use client';

import Layout from '../../../components/Layout';
import { useState, useEffect } from 'react';
import { apiRequest } from '../../../services/api';
import { Building, Plus, Edit, Trash2, Search, X, AlertCircle, Eye, User, ChevronDown, RefreshCw, BookOpen } from 'lucide-react';
import dynamic from "next/dynamic";

const Pagination = dynamic(() => import('@/components/Pagination'), {
  loading: () => <p>Loading pagination...</p>,
});

const AssignBranchModal = dynamic(() => import('@/components/AssignBranchModal'), {
  loading: () => <p>Loading form...</p>,
});

export default function AssignBranch() {

  const [branches, setBranches] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [assignments, setAssignment] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    branch: "",
    teacher: "",
  });
  const limit = 5;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchTerm]);


  useEffect(() => {
    fetchAssignments();
  }, [page, debouncedSearch, selectedBranch]);


  const handleRetry = () => {
    setError('');
    fetchAssignments();
  };

  useEffect(() => {
    fetchBranches();
    fetchTeachers();
  }, []);


  const fetchAssignments = async () => {

    try {
      setLoading(true);
      let url = `/assignbranch?&limit=${limit}&page=${page}`;

      if (debouncedSearch != '') {
        url += `&search=${debouncedSearch}`;
      }

      if (selectedBranch !== 'all') {
        url += `&branch=${selectedBranch}`;
      }

      const response = await apiRequest(url);
      if (response && response.success) {
        setAssignment(response.data);
        setTotalPages(response.totalPages);
      }

      else {
        setAssignment([]);
        setTotalPages(1);
      }
    }

    catch (err) {
      console.error('Error fetching assignments:', err);
    }

    finally {
      setLoading(false);
    }
  }

  const fetchTeachers = async () => {
    try {
      const response = await apiRequest('/teachers/all');
      if (response && response.success) {
        setTeachers(response.data);
      }
      else {
        setTeachers([]);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setTeachers([]);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await apiRequest('/branches/all');
      if (response && response.success) {
        setBranches(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');

  };

  const refreshTeachersAndBranches = async () => {
    try {
      await Promise.all([
        fetchTeachers(),
        fetchBranches()
      ]);
    } catch (error) {
      console.error('Error refreshing teachers and Branches:', error);
    }
  };

  const openCreateModal = async () => {
    await refreshTeachersAndBranches();
    setFormData({
      teacher: '',
      branch: '',
    });
    setError('');
    setShowModal(true);
  };

  const validateForm = () => {
    if (!formData.teacher) {
      setError('Please select a teacher');
      return false;
    }
    if (!formData.branch) {
      setError('Please select a branch');
      return false;
    }
    return true;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await apiRequest('/assignbranch', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      if (response && response.success) {
        setSuccessMessage('Branch assigned successfully!');
        await fetchAssignments();

        await refreshTeachersAndBranches();
        setTimeout(() => {
          setShowModal(false);
          setSuccessMessage('');
        }, 1500);
      }
      else {
        setError(response.message || 'Failed to assign subject');
      }
    }
    catch (error) {
      console.error('Error assigning subject:', error);
      if (error.message?.includes('already exists')) {
        setError('This assignment already exists!');
      } else {
        setError(error.message || 'Error assigning subject. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getBranchName = (branch) => {
    if (!branch) return 'N/A';
    return typeof branch === 'object' ? branch.branchName : 'Unknown';
  };

  const getTeacherName = (teacher) => {
    if (!teacher) return 'N/A';
    return typeof teacher === 'object' ? teacher.fullName : 'Unknown';
  };

  const getBranchLoc = (branch) => {
    if (!branch) return 'N/A';
    return typeof branch === 'object' ? branch.location : "Unknown";
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this assignment? This action cannot be undone.')) return;
    try {
      const response = await apiRequest(`/assignbranch/${id}`, {
        method: 'DELETE'
      });
      if (response?.success || response?.message === 'Deleted successfully') {
        setSuccessMessage('Assignment Deactviated successfully!');
        await fetchAssignments();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response?.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Error deleting assignment:', error);
      setError(error.message || 'Error deleting assignment. Please try again.');
    }
  };

  if (loading && assignments.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-700">Loading assignments...</span>
            </div>
            {error && (
              <div className="text-red-600 mb-4">
                <p>{error}</p>
                <button
                  onClick={handleRetry}
                  className="mt-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition flex items-center gap-2 mx-auto"
                >
                  <RefreshCw size={16} /> Retry
                </button>
              </div>
            )}
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Assign Branches to Teachers</h2>
          <p className="text-gray-700">Manage teacher branch assignments</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus size={18} /> Assign Branch
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button
            onClick={() => setError('')}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}


      <div className="mb-6 grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* Branch Filter */}
        <div className="relative">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full pl-3 pr-10 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none appearance-none bg-white"
          >
            <option value="all">All Branches</option>
            {branches.map(branch => (
              <option key={branch._id} value={branch._id}>
                {branch.branchName}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
        </div>

        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by teacher.."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1) }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {assignments.length > 0 ? (
              assignments.map((assignment, index) => (
                <tr key={assignment._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{(page - 1) * limit + index + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center gap-1">
                      <User size={16} className="text-gray-500" />
                      {getTeacherName(assignment.teacher)}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center gap-1">
                      <BookOpen size={16} className="text-gray-500" />
                      {getBranchName(assignment.branch)}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center gap-1">
                      <Building size={16} className="text-gray-500" />
                      {getBranchLoc(assignment.branch)}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDelete(assignment._id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded transition"
                      title="Remove Assignment"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  {searchTerm
                    ? 'No assignments match your search criteria.'
                    : 'No assignments found. Click "Assign Subject" to create one.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div>
        <Pagination totalPages={totalPages} setPage={setPage} page={page} />
      </div>


      {showModal && (
        <AssignBranchModal
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          submitting={submitting}
          error={error}
          successMessage={successMessage}
          setShowModal={setShowModal}
          branches={branches}
          teachers={teachers}
        />
      )}
    </Layout>  
  );
}
