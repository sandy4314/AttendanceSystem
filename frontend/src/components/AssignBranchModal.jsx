'use client';

import { X, AlertCircle } from 'lucide-react';

export default function AssignBranchModal({
    formData,
    handleInputChange,
    handleSubmit,
    submitting,
    error,
    successMessage,
    setShowModal,
    branches,
    teachers
}) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-xl w-full max-w-2xl p-6 m-4">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Assign Subject to Teacher</h3>
                    <button
                        onClick={() => setShowModal(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                        disabled={submitting}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Branch <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="branch"
                                value={formData.branch}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
                                required
                                disabled={submitting}
                            >
                                <option value="">Choose a branch</option>
                                {branches.length > 0 ? (
                                    branches.map(branch => (
                                        <option key={branch._id} value={branch._id}>
                                            {branch.branchName}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>No branches available</option>
                                )}
                            </select>
                        </div>


                        {/* Teacher Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Teacher <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="teacher"
                                value={formData.teacher}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
                                required
                                disabled={submitting}
                            >
                                <option value="">Choose a teacher</option>
                                {teachers.length > 0 ? (
                                    teachers.map(teacher => (
                                        <option key={teacher._id} value={teacher._id}>
                                            {teacher.fullName} {teacher.employeeId ? `- ${teacher.employeeId}` : ''}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>No teachers available</option>
                                )}
                            </select>
                            {teachers.length === 0 && (
                                <p className="text-xs text-amber-600 mt-1">
                                    No teachers found. Please add teachers first.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
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
                            disabled={submitting || teachers.length === 0 || branches.length === 0}
                            className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition disabled:opacity-50 flex items-center gap-2 font-medium"
                        >
                            {submitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Assigning...
                                </>
                            ) : (
                                'Assign Branch'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}