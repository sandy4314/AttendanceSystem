'use client';

import Layout from '../../../components/Layout';
import { useState, useEffect } from 'react';
import { apiRequest } from '../../../services/api';
import {Building,Plus,Edit,Trash2,Search,X,AlertCircle,Eye,User,ChevronDown} from 'lucide-react';
import Pagination from '@/components/Pagination';
import {useAuth} from '@/components/AuthContext';



export default function SectionsPage() {
  const [sections, setSections] = useState([]);
  const [branches, setBranches] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Filter states
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedClass, setSelectedClass] = useState('all');
  const [availableClasses, setAvailableClasses] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 5;
  const {user,loading:authLoading}= useAuth();


  // Form state
  const [formData, setFormData] = useState({
    branch: '',
    classRef: '',
    sectionName: '',
    sectionIncharge: ''
  });

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchTerm);
  }, 1000);

  return () => clearTimeout(timer);
}, [searchTerm]);

useEffect(()=>{

    fetchBranches();
  },[]);

  useEffect(() => {
  if (selectedBranch) {
    fetchTeachers();
  }
}, [selectedBranch]);

  
useEffect(() => {
  if (selectedBranch) {
    fetchSections(page);
  }
}, [page, selectedBranch, selectedClass, debouncedSearch]);


useEffect(() => {
  if (selectedBranch) {
    fetchClassesByBranch(selectedBranch);
  }
}, [selectedBranch]);
 




useEffect(()=>{
    if(user)
      {
        if (!user.linkedId) {
          console.error('No linkedId found in user data');
          return;
        }
        setSelectedBranch(user.linkedId);
    }

  },[user]);
  


  

  const fetchSections = async (pageNumber=1) => {
    try {
      setLoading(true);
      setError('');
      
      let url=`/sections?page=${pageNumber}&limit=${LIMIT}`;

      if (selectedBranch) {
      url += `&branchId=${selectedBranch}`;
    }

      if (selectedClass !== "all") {
        url += `&classId=${selectedClass}`;
    }


    if (debouncedSearch !== '') {
        url += `&search=${debouncedSearch}`;
      }





      const response = await apiRequest(url);
      if (response && response.success) {
        setSections(response.data || []);
        setTotalPages(response.totalPages || 1);
      } else {
        setSections([]);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
      setError('Failed to load sections. Please try again.');
      setSections([]);
    } finally {
      setLoading(false);
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

  const fetchTeachers = async () => {
  try {

    let url = `/assignbranch/all`;

    if (selectedBranch) {
      url += `?branch=${selectedBranch}`;
    }

    const response = await apiRequest(url);

    if (response && response.success) {
      setTeachers(response.data || []);
    }

  } catch (error) {
    console.error('Error fetching teachers:', error);
  }
};

  const fetchClassesByBranch = async (branchId) => {
  try {
    const response = await apiRequest(`/classes?branchId=${branchId}&limit=100`);

    if (response && response.success) {
      setAvailableClasses(response.data || []);
    } else {
      setAvailableClasses([]);
    }

  } catch (error) {
    console.error("Error fetching classes:", error);
    setAvailableClasses([]);
  }
};

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
    if (name === 'branch' && value && !editingSection) {
      
      fetchClassesByBranch(value);

      setFormData(prev => ({
        ...prev,
        classRef: ''
      }));
    }
  };

  const openCreateModal = () => {
    setEditingSection(null);
    setFormData({
      branch: selectedBranch,
      classRef: '',
      sectionName: '',
      sectionIncharge: ''
    });
    
    setError('');
    setSuccessMessage('');
    setShowModal(true);
  };

  const openEditModal = (section) => {
    setEditingSection(section);
    setFormData({
      branch: section.branch?._id || section.branch || '',
      classRef: section.classRef?._id || section.classRef || '',
      sectionName: section.sectionName || '',
      sectionIncharge: section.sectionIncharge?._id || section.sectionIncharge || ''
    });
    const branchId = section.branch?._id || section.branch;
    

    setError('');
    setSuccessMessage('');
    setShowModal(true);
  };

  const openDetailsModal = (section) => {
    setSelectedSection(section);
    setShowDetailsModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      let response;
      if (editingSection) {
        const updateData = {};
        if (formData.sectionName) {
          updateData.sectionName = formData.sectionName;
        }
        if (formData.sectionIncharge) {
          updateData.sectionIncharge = formData.sectionIncharge;
        }
        response = await apiRequest(`/sections/${editingSection._id}`, {
          method: 'PUT',
          body: JSON.stringify(updateData)
        });
      } else {
        if (!formData.branch) {
          setError('Please select a branch');
          setSubmitting(false);
          return;
        }
        if (!formData.classRef) {
          setError('Please select a class');
          setSubmitting(false);
          return;
        }
        const createData = {
          branch: formData.branch,
          classRef: formData.classRef,
          sectionName: formData.sectionName
        };
        if (formData.sectionIncharge) {
          createData.sectionIncharge = formData.sectionIncharge;
        }
        response = await apiRequest('/sections', {
          method: 'POST',
          body: JSON.stringify(createData)
        });
      }
      if (response && response.success) {
        setSuccessMessage(editingSection ? 'Section updated successfully!' : 'Section created successfully!');
        await fetchSections();


        setTimeout(() => {
          setShowModal(false);
          setSuccessMessage('');
        }, 1500);
      } else {
        setError(response?.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving section:', error);
      if (error.message && error.message.includes('already exists')) {
        setError('A section with this name already exists in the selected class.');
      } else if (error.message && error.message.includes('Teacher not found')) {
        setError('Selected teacher not found. Please choose another teacher.');
      } else if (error.message && error.message.includes('Class not found')) {
        setError('Selected class not found. Please choose another class.');
      } else if (error.message && error.message.includes('Branch not found')) {
        setError('Selected branch not found. Please choose another branch.');
      } else if (error.message && error.message.includes('does not belong to this branch')) {
        setError('Selected class does not belong to the chosen branch.');
      } else {
        setError(error.message || 'Error saving section. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this section? This action cannot be undone and may affect associated students.')) return;
    try {
      setError('');
      const response = await apiRequest(`/sections/${id}`, {
        method: 'DELETE'
      });
      if (response && response.success) {
        setSuccessMessage('Section deleted successfully!');
        
        await fetchSections();
        
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response?.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Error deleting section:', error);
      setError(error.message || 'Error deleting section. Please try again.');
    }
  };

  // Filter sections based on search and branch filter
  const filteredSections = sections;

    

  const getBranchName = (branch) => {
    if (!branch) return 'N/A';
    if (typeof branch === 'object') return branch.branchName || 'Unknown';
    const found = branches.find(b => b._id === branch);
    return found ? found.branchName : 'Unknown Branch';
  };

  const getClassName = (cls) => {
    if (!cls) return 'N/A';
    if (typeof cls === 'object') return cls.className || 'Unknown';
    const found = classes.find(c => c._id === cls);
    return found ? found.className : 'Unknown Class';
  };

  const getTeacherName = (teacher) => {
    if (!teacher) return 'Not Assigned';
    if (typeof teacher === 'object') return teacher.fullName || 'Unknown';
    const found = teachers.find(t => t._id === teacher);
    return found ? found.fullName : 'Unknown Teacher';
  };

  if (loading && sections.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-700">Loading sections...</span>
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
          <h2 className="text-3xl font-bold text-gray-900">Sections</h2>
          <p className="text-gray-700">Manage sections/divisions for each class</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={18} /> Create Section
        </button>
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

      {/* FILTERS AND SEARCH */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Branch Filter */}
        <div className="relative">
          <select
            value={selectedBranch || ""}
            onChange={(e) => {setSelectedBranch(e.target.value);
              setPage(1)}           
            }

            disabled={true}

            className="w-full pl-3 pr-10 py-2 border border-gray-400 text-black rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none appearance-none bg-white"
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

        {/* Class Filter - Only shown when branch is selected */}
        
          <div className="relative">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="text-black w-full pl-3 pr-10 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none appearance-none bg-white"
            >
              <option value="all">All Classes in Branch</option>
              {availableClasses.map(cls => (
                <option key={cls._id} value={cls._id}>
                  {cls.className}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
          </div>
        

        {/* Search Bar */}
        <div className={`relative ${selectedBranch !== 'all' ? 'md:col-span-2' : 'md:col-span-3'}`}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by section name.."
            value={searchTerm}
            onChange={(e) =>{setSearchTerm(e.target.value);setPage(1)}}
            
            className="w-full pl-10 pr-4 py-2 border border-gray-400 text-black rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* SECTIONS TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section Teacher</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSections.length > 0 ? (
              filteredSections.map((section, index) => (
                <tr key={section._id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{(page - 1) * LIMIT + index + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{section.sectionName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {section.classRef?.className || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center gap-1">
                      <Building size={14} className="text-gray-500" />
                      {getBranchName(section.branch)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center gap-1">
                      <User size={14} className="text-gray-500" />
                      {getTeacherName(section.sectionIncharge)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openDetailsModal(section)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded transition"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => openEditModal(section)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded transition"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(section._id)}
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
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  {selectedBranch !== 'all' && selectedClass !== 'all'
                    ? 'No sections found for this class. Click "Create Section" to add one.'
                    : selectedBranch !== 'all'
                      ? 'No sections found for this branch. Click "Create Section" to add one.'
                      : 'No sections found. Click "Create Section" to add one.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div>

              <Pagination page={page} setPage={setPage} totalPages={totalPages}/>

      </div>
      {/* CREATE/EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 my-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {editingSection ? 'Edit Section' : 'Create New Section'}
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
                {/* Branch Selection - Disabled in edit mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch *
                  </label>
                  <select
                    name="branch"
                    value={selectedBranch}
                    onChange={handleInputChange}
                    required={!editingSection}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-400 text-black rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none disabled:bg-gray-100"
                  >
                    <option value="">Select Branch</option>
                    {branches.map(branch => (
                      <option key={branch._id} value={branch._id}>
                        {branch.branchName}
                      </option>
                    ))}
                  </select>
                  {editingSection && (
                    <p className="text-xs text-gray-500 mt-1">Branch cannot be changed after creation</p>
                  )}
                </div>
                {/* Class Selection - Disabled in edit mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class *
                  </label>
                  <select
                    name="classRef"
                    value={formData.classRef}
                    onChange={handleInputChange}
                    required={!editingSection}
                    disabled={submitting || editingSection || !selectedBranch}
                    className="w-full px-3 py-2 border border-gray-400 text-black rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none disabled:bg-gray-100"
                  >
                    <option value="">Select Class</option>
                    {availableClasses.map(cls => (
                      <option key={cls._id} value={cls._id}>
                        {cls.className}
                      </option>
                    ))}
                  </select>
                  {!formData.branch && !editingSection && (
                    <p className="text-xs text-gray-500 mt-1">Please select a branch first</p>
                  )}
                  {editingSection && (
                    <p className="text-xs text-gray-500 mt-1">Class cannot be changed after creation</p>
                  )}
                </div>
                {/* Section Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section Name *
                  </label>
                  <input
                    type="text"
                    name="sectionName"
                    value={formData.sectionName}
                    onChange={handleInputChange}
                    required
                    disabled={submitting}
                    className="w-full px-3 py-2 border border-gray-400 text-black rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none disabled:bg-gray-100"
                    placeholder="e.g., section-1 section-2"
                  />
                </div>
                {/* Section Teacher */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section Teacher (Optional)
                  </label>
                  <select
                    name="sectionIncharge"
                    value={formData.sectionIncharge}
                    onChange={handleInputChange}
                    disabled={submitting}
                    className="w-full px-3 py-2 border border-gray-400 text-black rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none disabled:bg-gray-100"
                  >
                    <option value="">Select Section Teacher</option>
                    {teachers.map(assign => (
                        <option key={assign.teacher._id} value={assign.teacher._id}>
                            {assign.teacher.fullName} ({assign.teacher.phone})
                        </option>
                        ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">You can assign or change the section teacher later</p>
                </div>
                {/* Additional info for editing */}
                {editingSection && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                    <p className="flex items-center gap-2">
                      <AlertCircle size={16} />
                      You can update the section name and section teacher. Branch and class cannot be changed.
                    </p>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {submitting ? 'Saving...' : (editingSection ? 'Update Section' : 'Create Section')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* SECTION DETAILS MODAL */}
      {showDetailsModal && selectedSection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Section Details</h3>
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
                    <p className="text-sm text-gray-500">Section Name</p>
                    <p className="font-medium text-gray-900">{selectedSection.sectionName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Class</p>
                    <p className="text-gray-900">{selectedSection.classRef?.className || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Branch</p>
                    <div className="flex items-center gap-1">
                      <Building size={14} className="text-gray-500" />
                      <p className="text-gray-900">{getBranchName(selectedSection.branch)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Section Teacher</p>
                    <div className="flex items-center gap-1">
                      <User size={14} className="text-gray-500" />
                      <p className="text-gray-900">{getTeacherName(selectedSection.sectionIncharge)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Section ID</p>
                    <p className="font-mono text-sm text-gray-900">{selectedSection._id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created At</p>
                    <p className="text-gray-900">{selectedSection.createdAt ? new Date(selectedSection.createdAt).toLocaleString() : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="text-gray-900">{selectedSection.updatedAt ? new Date(selectedSection.updatedAt).toLocaleString() : 'N/A'}</p>
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