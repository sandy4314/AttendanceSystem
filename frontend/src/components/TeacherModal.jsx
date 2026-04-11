'use client';

import { X, AlertCircle } from 'lucide-react';

export default function TeacherModal({
    editingTeacher,
    formData,
    handleInputChange,
    handleSubmit,
    submitting,
    error,
    successMessage,
    setShowModal
}) {
    return (
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
    )
}