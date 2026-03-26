'use client';

import Layout from '../../../components/Layout';
import { useState, useEffect } from 'react';
import { apiRequest } from '../../../services/api';
import { useRouter } from 'next/navigation';
import {Plus,Edit,Trash2,Search,X,AlertCircle,Phone,Eye,IndianRupee} from 'lucide-react';
import Pagination from '@/components/Pagination';
import {useAuth} from '@/context/AuthContext';


export default function BranchTeachers() {
  const router = useRouter();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
 
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const {user,loading:authLoading}= useAuth();


  const limit=5;


   const [formData, setFormData] = useState({
    fullName: '',
    salary: '',
    phone: '',
    username: '',
    password: ''
  });
  

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchTerm]);


  useEffect(()=>{
    if(user){

        fetchTeachers();

    }
    
  },[page,debouncedSearch,user])

  const fetchTeachers = async () => {
  try {

    setLoading(true);
    setError("");

    


      let url=`/assignbranch/branch/${user.linkedId}?page=${page}&limit=${limit}`;
    
    

    
    if (debouncedSearch !== '') {
        url += `&search=${debouncedSearch}`;
      }

    const response = await apiRequest(url);

    if (response?.success) {
      setTeachers(response.data || []);
      console.log("teachers",response.data);
      setTotalPages(response.totalPages || 1);
    } else {
      setTeachers([]);
    }

  } catch (error) {

    console.error(error);
    setError("Failed to load teachers");

  } finally {

    setLoading(false);

  }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    setError('');
  };

 

  const openEditModal = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      fullName: teacher?.teacher?.fullName || '',
      salary: teacher?.teacher?.salary || '',
      phone: teacher?.teacher?.phone || '',
      username: '', // Username cannot be edited through teacher update
      password: ''  // Password cannot be edited through teacher update
    });
    setError('');
    setSuccessMessage('');
    setShowModal(true);
  };

  const openDetailsModal = (teacher) => {
    setSelectedTeacher(teacher);
    setShowDetailsModal(true);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setSubmitting(true);
  setError('');
  setSuccessMessage('');

  try {

    if (!editingTeacher) return;

    const updateData = {
      fullName: formData.fullName,
      salary: formData.salary ? parseFloat(formData.salary) : undefined,
      phone: formData.phone
    };

    const response = await apiRequest(`/teachers/${editingTeacher?.teacher?._id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });

    if (response?.success) {

      setSuccessMessage("Teacher Updated Successfully");

      await fetchTeachers();

      setTimeout(() => {
        setShowModal(false);
        setEditingTeacher(null);
        setSuccessMessage('');
      }, 1200);

    } else {
      setError(response?.message || "Update failed");
    }

  } catch (error) {
    console.error(error);
    setError(error.message || "Error saving teacher");
  } finally {
    setSubmitting(false);
  }
};



  const handleDelete = async (id) => {

    if (!confirm('Are you sure you want to delete this teacher? This action cannot be undone and will remove the teacher and their login credentials.')) return;

    try {
      setError('');
      const response = await apiRequest(`/teachers/${id}`, {
        method: 'DELETE'
      });
      if (response && response.success) {
        setSuccessMessage('Teacher deleted successfully!');
        await fetchTeachers();
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response?.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Error deleting teacher:', error);
      setError(error.message || 'Error deleting teacher. Please try again.');
    }
  };
  

  // Filter teachers based on search
  const filteredTeachers = teachers;
  
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-700">Loading teachers...</span>
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
          <h2 className="text-3xl font-bold text-gray-900">Teachers</h2>
          <p className="text-gray-700">Manage all teachers</p>
        </div>
        
      </div>
      {/* Error Message */}
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
      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by name, phone, or salary..."
          value={searchTerm}
          onChange={(e) => {setSearchTerm(e.target.value);setPage(1)}}
          className="w-full pl-10 pr-4 py-2 border border-gray-400 text-black rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
        />
      </div>

      {/* TEACHERS TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map((teacher, index) => (
                <tr key={teacher._id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{(page - 1) * limit + index + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{teacher?.teacher.fullName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center gap-1">
                      <Phone size={14} className="text-gray-500" />
                      {teacher?.teacher?.phone || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center gap-1">
                      <IndianRupee size={14} className="text-gray-500" />
                     {teacher?.teacher?.salary 
                          ? teacher.teacher.salary.toLocaleString() 
                          : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openDetailsModal(teacher)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded transition"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => openEditModal(teacher)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded transition"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(teacher?.teacher._id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded transition"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No teachers found. Click "Add Teacher" to add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div>
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </div>

      {/* CREATE/EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 my-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 transition"
                disabled={submitting}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Error Message */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Modal Success Message */}
            {successMessage && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Basic Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    disabled={submitting}
                    className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none disabled:bg-gray-100"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    disabled={submitting}
                    className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none disabled:bg-gray-100"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary
                  </label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    min="0"
                    step="1000"
                    disabled={submitting}
                    className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none disabled:bg-gray-100"
                    placeholder="Enter salary (optional)"
                  />
                </div>

                {/* Login Credentials - Only shown for new teachers */}
                {!editingTeacher && (
                  <>
                    <div className="border-t pt-4 mt-2">
                      <h4 className="font-semibold text-gray-700 mb-3">Login Credentials</h4>
                      <p className="text-xs text-gray-500 mb-3">These will be used by the teacher to login to the system</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username *
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required={!editingTeacher}
                        disabled={submitting || editingTeacher}
                        className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none disabled:bg-gray-100"
                        placeholder="Enter username for login"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password *
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required={!editingTeacher}
                        disabled={submitting || editingTeacher}
                        className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none disabled:bg-gray-100"
                        placeholder="Enter password"
                      />
                    </div>
                  </>
                )}

                {/* Note for editing */}
                {editingTeacher && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                    <p className="flex items-center gap-2">
                      <AlertCircle size={16} />
                      Note: Username and password cannot be edited here. To reset password, use the admin tools.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="text-gray-700 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="text-gray-700 px-4 py-2 bg-amber-500 rounded-lg hover:bg-amber-600 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {submitting ? 'Saving...' : (editingTeacher ? 'Update Teacher' : 'Add Teacher')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TEACHER DETAILS MODAL */}
      {showDetailsModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Teacher Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-3">Information</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-900">{selectedTeacher?.teacher?.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900">{selectedTeacher?.teacher?.phone}</p>
                  </div>
                  {selectedTeacher.salary && (
                    <div>
                      <p className="text-sm text-gray-500">Salary</p>
                      <p className="text-gray-900">₹{selectedTeacher?.teacher?.salary.toLocaleString()}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Teacher ID</p>
                    <p className="font-mono text-sm text-gray-900">{selectedTeacher?.teacher?._id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created At</p>
                    <p className="text-gray-900">{selectedTeacher?.teacher?.createdAt  || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="text-gray-900">{selectedTeacher?.teacher?.updatedAt || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}