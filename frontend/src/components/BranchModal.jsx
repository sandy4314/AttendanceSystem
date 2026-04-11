'use client';

import { X, AlertCircle } from 'lucide-react';

export default function BranchModal({
    editingBranch,
    formData,
    handleInputChange,
    handleSubmit,
    submitting,
    error,
    successMessage,
    setShowModal
}) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                        {editingBranch ? 'Edit Branch' : 'Create New Branch'}
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

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Branch Name *
                            </label>
                            <input
                                type="text"
                                name="branchName"
                                value={formData.branchName}
                                onChange={handleInputChange}
                                required
                                disabled={submitting}
                                className="w-full px-3 py-2 border text-gray-700  border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none disabled:bg-gray-100"
                                placeholder="Enter branch name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                disabled={submitting}
                                className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none disabled:bg-gray-100"
                                placeholder="Enter location"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                disabled={submitting}
                                className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none disabled:bg-gray-100"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
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
                                required
                                disabled={submitting || editingBranch}
                                className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none disabled:bg-gray-100"
                                placeholder="Enter Username"
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
                                required
                                disabled={submitting || editingBranch}
                                className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none disabled:bg-gray-100"
                                placeholder="Enter Password"
                            />
                        </div>

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
                            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition disabled:opacity-50 flex items-center gap-2"
                        >
                            {submitting && (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            )}
                            {submitting ? 'Saving...' : (editingBranch ? 'Update' : 'Create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

