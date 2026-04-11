'use client';

import { X, AlertCircle } from 'lucide-react';

export default function SectionModal({
    editingSection,
    formData,
    handleInputChange,
    handleSubmit,
    submitting,
    error,
    successMessage,
    setShowModal,
    branches,
    availableClasses,
    teachers
}) {
    return (
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
                                value={formData.branch}
                                onChange={handleInputChange}
                                required={!editingSection}
                                disabled={submitting || editingSection}
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
                                disabled={submitting || editingSection || !formData.branch}
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
                                {teachers
                                    .filter(teacher => {
                                        // Optional: Filter teachers by branch if needed
                                        return true;
                                    })
                                    .map(teacher => (
                                        <option key={teacher._id} value={teacher._id}>
                                            {teacher.fullName} {teacher.phone ? `(${teacher.phone})` : ''}
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
    );
}