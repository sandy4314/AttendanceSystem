'use client';

import Layout from "@/components/Layout";
import { useEffect, useState, useCallback } from "react";
import { apiRequest } from "@/services/api";

export default function MarkAttendance() {

  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [existingAttendanceId, setExistingAttendanceId] = useState(null);

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [description, setDescription] = useState("");

  const [loadingStudents, setLoadingStudents] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.linkedId) return;

    apiRequest(`/assignsubject/teacher/${user.linkedId}`)
      .then(res => {
        if (res?.success) setAssignments(res.data || []);
      });
  }, []);

  
  const loadStudents = useCallback(async (assignment) => {
    if (!assignment?.section?._id) return;

    setLoadingStudents(true);
    setError("");
    setStudents([]);
    setAttendance({});
    setExistingAttendanceId(null);

    const res = await apiRequest(`/students/section/${assignment.section._id}`);

    if (res?.success) {
      setStudents(res.data || []);
      
    }

    setLoadingStudents(false);
  }, []);

 
  const checkExistingAttendance = async () => {
    if (!selectedAssignment || !date || !timeSlot) return;

    const res = await apiRequest(
      `/attendance/session?assignmentId=${selectedAssignment._id}&date=${date}&timeSlot=${timeSlot}`
    );

    if (res?.exists) {
      const existing = res.data;
      setExistingAttendanceId(existing._id);

      const mapped = {};
      existing.students.forEach(s => {
        mapped[s.student] = s.status;
      });

      setAttendance(mapped);
      setDescription(existing.description || "");
    }

    else {
    
    const initial = {};
    students.forEach(s => {
      initial[s._id] = "P";
    });

    setAttendance(initial);
    setExistingAttendanceId(null);
    setDescription("");
  }


  };

  useEffect(() => {
  if (selectedAssignment && date && timeSlot) {
    checkExistingAttendance();
  }
}, [selectedAssignment, date, timeSlot,students]);

 
  const presentCount = Object.values(attendance).filter(v => v === "P").length;
  const absentCount = Object.values(attendance).filter(v => v === "A").length;

  
  const markAll = (status) => {
    const updated = {};
    students.forEach(s => updated[s._id] = status);
    setAttendance(updated);
  };
 


  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    const studentArray = students.map(s => ({
      student: s._id,
      status: attendance[s._id]
    }));

    try {

      if (existingAttendanceId) {
        
        await apiRequest(`/attendance/${existingAttendanceId}`, {
          method: "PUT",
          body: JSON.stringify({
            
            students: studentArray
          })
        });

        alert("Attendance updated successfully");

      } else {
       
        await apiRequest("/attendance", {
          method: "POST",
          body: JSON.stringify({
            assignmentId: selectedAssignment._id,
            date,
            timeSlot,
            description,
            students: studentArray
          })
        });

        alert("Attendance marked successfully");
      }

      await checkExistingAttendance();

    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <Layout>
      <div className="p-8 text-black">

        <h1 className="text-2xl font-bold mb-6">
          {existingAttendanceId ? "Edit Attendance" : "Mark Attendance"}
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

  {/* Assignment */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Select Class
    </label>
    <select
      className="w-full border border-gray-300 rounded-lg px-4 py-2 
                 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 
                 transition bg-white"
      value={selectedAssignment?._id || ""}
      onChange={(e) => {
        const selected = assignments.find(a => a._id === e.target.value);
        setSelectedAssignment(selected);
        setExistingAttendanceId(null);
        setDescription("");
        loadStudents(selected);
      }}
    >
      <option value="">Choose class...</option>
      {assignments.map(a => (
        <option key={a._id} value={a._id}>
          {a.subject.subjectName} - {a.classRef.className} ({a.section.sectionName})
        </option>
      ))}
    </select>
  </div>

  {/* Date */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Date
    </label>
    <input
      type="date"
      className="w-full border border-gray-300 rounded-lg px-4 py-1.5
                 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 
                 transition bg-white"
      value={date}
      onChange={(e) => setDate(e.target.value)}
    />
  </div>

  {/* Period */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Period
    </label>
    <select
      className="w-full border border-gray-300 rounded-lg px-4 py-2
                 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 
                 transition bg-white"
      value={timeSlot}
      onChange={(e) => setTimeSlot(e.target.value)}
    >
    <option value="">Select period</option>
            <option value="09:00-09:45">09:00 - 09:45</option>
            <option value="09:45-10:30">09:45 - 10:30</option>
      
            <option value="10:45-11:30">10:45 - 11:30</option>
            <option value="11:30-12:15">11:30 - 12:15</option>
          
            <option value="13:15-14:00">01:15 - 02:00</option>
            <option value="14:00-14:45">02:00 - 02:45</option>
           
            <option value="15:00-15:45">03:00 - 3:45</option>
            <option value="15:45-16:30">03:45 - 4:30</option>

            

    </select>
  </div>

</div>

        {/* Counters */}
        {students.length > 0 && (
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-6 text-sm font-medium">
              <span className="text-green-600">Present: {presentCount}</span>
              <span className="text-red-600">Absent: {absentCount}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => markAll("P")}
                className="px-3 py-1 bg-green-500 text-white rounded"
              >
                Mark All Present
              </button>
              <button
                onClick={() => markAll("A")}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Mark All Absent
              </button>
            </div>
          </div>
        )}

        {/* Students Table */}
        {students.length > 0 && (
  <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200">
    
    <div style={{ maxHeight: "500px" }} className="overflow-y-auto">

      <table className="w-full text-sm">
        
        {/* HEADER */}
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr className="text-gray-600 text-xs uppercase tracking-wider">
            <th className="px-6 py-3 text-left">Roll No</th>
            <th className="px-6 py-3 text-left">Student Name</th>
            <th className="px-6 py-3 text-center">Attendance</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="divide-y divide-gray-100">
          {students.map((s, index) => (
            <tr
              key={s._id}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-amber-50 transition`}
            >
              <td className="px-6 py-4 text-gray-700">
                {s.rollNo}
              </td>

              <td className="px-6 py-4 font-medium text-gray-900">
                {s.fullName}
              </td>

              <td className="px-6 py-4">
                <div className="flex justify-center gap-8">

                  {/* Present */}
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name={`attendance-${s._id}`}
                      checked={attendance[s._id] === "P"}
                      onChange={() =>
                        setAttendance(prev => ({
                          ...prev,
                          [s._id]: "P"
                        }))
                      }
                      className="w-4 h-4 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-green-600 font-semibold group-hover:scale-105 transition">
                      Present
                    </span>
                  </label>

                  {/* Absent */}
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name={`attendance-${s._id}`}
                      checked={attendance[s._id] === "A"}
                      onChange={() =>
                        setAttendance(prev => ({
                          ...prev,
                          [s._id]: "A"
                        }))
                      }
                      className="w-4 h-4 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-red-600 font-semibold group-hover:scale-105 transition">
                      Absent
                    </span>
                  </label>

                </div>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  </div>
)}

       
        <textarea
          className="w-full p-3  mt-4   border-gray-300 rounded-lg 
                 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 
                 transition bg-white"
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What was taught today?"
        />

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {submitting
            ? "Processing..."
            : existingAttendanceId
              ? "Update Attendance"
              : "Submit Attendance"}
        </button>

      </div>
    </Layout>
  );
}