'use client';

import { X, AlertCircle, UserCircle, BookOpen } from 'lucide-react';

export default function StudentModal({
    editingStudent,
    formData,
    handleInputChange,
    handleSubmit,
    submitting,
    error,
    setShowModal,
    branches,
    availableClasses,
    availableSections
}) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-xl w-full max-w-4xl p-6 m-4">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                        {editingStudent ? 'Edit Student' : 'Add New Student'}
                    </h3>
                    <button
                        onClick={() => setShowModal(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                        disabled={submitting}
                    >
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    {/* Personal Information Section */}
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <UserCircle size={20} className="text-amber-500" />
                            Personal Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Full Name */}
                            <div className="col-span-2 lg:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
                                    required
                                    disabled={submitting}
                                    placeholder="Enter full name"
                                />
                            </div>
                            {/* Roll Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Roll Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="rollNo"
                                    value={formData.rollNo}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
                                    required
                                    disabled={submitting || editingStudent}
                                    placeholder="Enter roll number"
                                />
                                {editingStudent && (
                                    <p className="text-xs text-gray-500 mt-1">Cannot be edited</p>
                                )}
                            </div>
                            {/* Parent Mobile */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Parent Mobile <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="parentMobile"
                                    value={formData.parentMobile}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
                                    required
                                    disabled={submitting}
                                    placeholder="10 digit mobile"
                                />
                            </div>
                            {/* Father's Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Father's Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="parentName"
                                    value={formData.parentName}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
                                    required
                                    disabled={submitting}
                                    placeholder="Enter father's name"
                                />
                            </div>
                            {/* Mother's Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mother's Name
                                </label>
                                <input
                                    type="text"
                                    name="motherName"
                                    value={formData.motherName}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
                                    disabled={submitting}
                                    placeholder="Enter mother's name (optional)"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Academic Information Section */}
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <BookOpen size={20} className="text-amber-500" />
                            Academic Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Branch Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Branch <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="branch"
                                    value={formData.branch}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
                                    required
                                    disabled={submitting || editingStudent}
                                >
                                    <option value="">Select Branch</option>
                                    {branches.map(branch => (
                                        <option key={branch._id} value={branch._id}>
                                            {branch.branchName}
                                        </option>
                                    ))}
                                </select>
                                {editingStudent && (
                                    <p className="text-xs text-gray-500 mt-1">Cannot be changed</p>
                                )}
                            </div>

                            {/* Class Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Class <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="classRef"
                                    value={formData.classRef}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
                                    required
                                    disabled={submitting || editingStudent || !formData.branch}
                                >
                                    <option value="">Select Class</option>
                                    {availableClasses.map(cls => (
                                        <option key={cls._id} value={cls._id}>
                                            {cls.className}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Section Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Section <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="section"
                                    value={formData.section}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
                                    required
                                    disabled={submitting || editingStudent || !formData.classRef}
                                >
                                    <option value="">Select Section</option>
                                    {availableSections.map(section => (
                                        <option key={section._id} value={section._id}>
                                            {section.sectionName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Note for editing */}
                    {editingStudent && (
                        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
                            <p className="flex items-center gap-2">
                                <AlertCircle size={18} />
                                Note: Roll number, branch, class and section cannot be edited after creation.
                            </p>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                            <AlertCircle size={18} />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition disabled:opacity-50 flex items-center gap-2 font-medium"
                        >
                            {submitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    {editingStudent ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                <>
                                    {editingStudent ? 'Update Student' : 'Create Student'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}