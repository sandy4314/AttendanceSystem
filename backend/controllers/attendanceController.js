const Attendance = require('../models/Attendance');
const TeacherSubjectAssignment = require('../models/TeacherSubjectAssignment');
const mongoose =require('mongoose');


exports.markAttendance = async (req, res) => {
  const { assignmentId, date, timeSlot, description, students } = req.body;
  
  try {
    if (!assignmentId || !date || !timeSlot ||  !Array.isArray(students) ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    

    // 1️⃣ Validate assignment
    const assignment = await TeacherSubjectAssignment.findById(assignmentId);

    if (!assignment || !assignment.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Invalid assignment'
      });
    }

    // 2️⃣ Ensure teacher is marking their own class
    if (assignment.teacher.toString() !== req.user.linkedId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to mark attendance for this class'
      });
    }

    // 4️⃣ Create attendance document
    const attendance = await Attendance.create({
      assignment: assignmentId,
      branch: assignment.branch,
      classRef: assignment.classRef,
      section: assignment.section,
      subject: assignment.subject,
      teacher: assignment.teacher,
      date,
      timeSlot,
      description,
      students
    });

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      data: attendance
    });

  } catch (err) {
    // Handle duplicate index error
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for this session"
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};



exports.getStudentAttendance = async (req, res) => {
  const { studentId } = req.params;
  const year = parseInt(req.query.year);
  const month = parseInt(req.query.month);


    if(!year || !month){
      return res.status(400).json({
        success:false,
        message:"Year and Month are required"
      });
    }


  try {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Student ID"
      });
    }

    const result = await Attendance.aggregate([

      {
        $match: {
          "students.student": new mongoose.Types.ObjectId(studentId)
        }
      },

      // Filter by year and month
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $year: "$date" }, year] },
              { $eq: [{ $month: "$date" }, month] }
            ]
          }
        }
      },

      {
        $lookup: {
          from: "subjects",
          localField: "subject",
          foreignField: "_id",
          as: "subjectData"
        }
      },

      { $unwind: "$subjectData" },

      { $unwind: "$students" },

      {
        $match: {
          "students.student": new mongoose.Types.ObjectId(studentId)
        }
      },

      {
        $project: {
          _id: 0,
          date: 1,
          timeSlot: 1,
          status: "$students.status",
          subjectName: "$subjectData.subjectName"
        }
      },

      { $sort: { date: -1, timeSlot: 1 } }

    ]);

    
    res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance",
      error: err.message
    });
  }
};






exports.getMyChildAttendance = async (req, res) => {
  try {

    const studentId = req.user.linkedId;

    const attendance = await Attendance.find({
      "students.student": studentId
    })
      .populate('subject', 'subjectName')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: attendance
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance'
    });
  }
};



exports.getMonthlyAttendancePercentage = async (req, res) => {
  const { studentId, year, month } = req.query;
  
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const result = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lt: endDate },
          "students.student": new mongoose.Types.ObjectId(studentId)
        }
        
      },
      { $unwind: "$students" },
      {
        $match: {
          "students.student": new mongoose.Types.ObjectId(studentId)
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          present: {
            $sum: {
              $cond: [{ $eq: ["$students.status", "P"] }, 1, 0]
            }
          }
        }
      }
    ]);

    if (result.length === 0) {
      return res.status(200).json({
        success: true,
        percentage: 0
      });
    }

    const percentage = (result[0].present / result[0].total) * 100;

    res.status(200).json({
      success: true,
      totalDays: result[0].total,
      presentDays: result[0].present,
      percentage: percentage.toFixed(2)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate attendance'
    });
  }
};





exports.getSectionAttendanceAnalytics = async (req, res) => {
  const { sectionId } = req.params;

  try {
    const result = await Attendance.aggregate([
      {
        $match: {
          section: new mongoose.Types.ObjectId(sectionId)
        }
      },
      { $unwind: "$students" },
      {
        $group: {
          _id: "$students.status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    });
  }
};



exports.updateAttendance = async (req, res) => {
  const { attendanceId } = req.params;
  const { students } = req.body;

  try {
    if (!students || !Array.isArray(students)) {
      return res.status(400).json({
        success: false,
        message: "Invalid students data"
      });
    }
 
    // Validate all statuses
    for (let s of students) {
      if (!["P", "A"].includes(s.status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status value"
        });
      }
    }

    const attendance = await Attendance.findById(attendanceId);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found"
      });
    }

    // Check teacher ownership
    if (attendance.teacher.toString() !== req.user.linkedId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to edit this attendance"
      });
    }

    attendance.students = students;

    await attendance.save();

    res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      data: attendance
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to update attendance"
    });
  }
};



exports.getAttendanceBySession = async (req, res) => {
  const { assignmentId, date, timeSlot } = req.query;

  try {
    const attendance = await Attendance.findOne({
      assignment: assignmentId,
      date,
      timeSlot
    });

    if (!attendance) {
      return res.status(200).json({
        success: true,
        exists: false
      });
    }

    res.status(200).json({
      success: true,
      exists: true,
      data: attendance
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance"
    });
  }
};