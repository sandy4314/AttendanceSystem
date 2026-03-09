const TeacherSubjectAssignment = require('../models/TeacherSubjectAssignment');
const Section = require('../models/Section');
const Branch = require('../models/Branch');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Subject = require('../models/Subject');

//create Assignment

exports.createAssignment = async (req, res) => {
  const { teacher, subject, branch, classRef, section } = req.body;

  try {
    if (!teacher || !subject || !branch || !classRef || !section) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
      
    const teacherExists = await Teacher.findById(teacher);
    if (!teacherExists) return res.status(404).json({ success: false, message: 'Teacher not found' });

    const subjectExists = await Subject.findById(subject);
    if (!subjectExists) return res.status(404).json({ success: false, message: 'Subject not found' });

    const branchExists = await Branch.findById(branch);
    if (!branchExists) return res.status(404).json({ success: false, message: 'Branch not found' });

    const classExists = await Class.findById(classRef);
    if (!classExists) return res.status(404).json({ success: false, message: 'Class not found' });

    if (classExists.branch.toString() !== branch.toString()) {
      return res.status(400).json({ success: false, message: 'Class does not belong to this branch' });
    }

    const sectionExists = await Section.findById(section);
    if (!sectionExists) return res.status(404).json({ success: false, message: 'Section not found' });

    if (sectionExists.classRef.toString() !== classRef.toString()) {
      return res.status(400).json({ success: false, message: 'Section does not belong to this class' });
    }

    const existing = await TeacherSubjectAssignment.findOne({
      teacher,
      subject,
      branch,
      classRef,
      section,
      isActive: true
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Assignment already exists'
      });
    }

    const assignment = await TeacherSubjectAssignment.create({
      teacher,
      subject,
      branch,
      classRef,
      section
    });

    res.status(201).json({
      success: true,
      message: 'Teacher subject assigned successfully',
      data: assignment
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to create assignment' });
  }
};



exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await TeacherSubjectAssignment.find({ isActive: true })
      .populate('teacher', 'fullName')
      .populate('subject', 'subjectName subjectCode')
      .populate('branch', 'branchName')
      .populate('classRef', 'className')
      .populate('section', 'sectionName');

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch assignments' });
  }
};



const mongoose = require("mongoose");


exports.getAssignments = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";

    const branchId = req.query.branchId;
    const classId = req.query.classId;
    const sectionId = req.query.sectionId;

    let matchStage = { isActive: true };

    // filter by branch/class/section
    if (branchId && branchId !== "all") {
      matchStage.branch = new mongoose.Types.ObjectId(branchId);
    }

    if (classId && classId !== "all") {
      matchStage.classRef = new mongoose.Types.ObjectId(classId);
    }

    if (sectionId && sectionId !== "all") {
      matchStage.section = new mongoose.Types.ObjectId(sectionId);
    }

    // 🔥 FAST teacher search
    if (search) {

      const teachers = await Teacher.find({
        fullName: { $regex: search, $options: "i" }
      }).select("_id");

      const teacherIds = teachers.map(t => t._id);

      matchStage.teacher = { $in: teacherIds };

    }

    const total = await TeacherSubjectAssignment.countDocuments(matchStage);

    const assignments = await TeacherSubjectAssignment.find(matchStage)
      .populate("teacher", "fullName")
      .populate("subject", "subjectName")
      .populate("branch", "branchName")
      .populate("classRef", "className")
      .populate("section", "sectionName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: assignments
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch assignments"
    });

  }
};




/* ================= GET ASSIGNMENTS BY TEACHER ================= */
exports.getAssignmentsByTeacher = async (req, res) => {
  try {
    const limit=parseInt(req.query.limit);
    const page=parseInt(req.query.page);
    const skip=(page-1)*limit;

    const filter={
      teacher:req.params.teacherId,
      isActive:true
    }

    const total =await TeacherSubjectAssignment.countDocuments(filter);

    const assignments = await TeacherSubjectAssignment.find(filter)
      .populate('subject', 'subjectName')
      .populate('classRef', 'className')
      .populate('section', 'sectionName')
      .populate('branch','branchName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    
    if (!assignments || assignments.length === 0) {
      
      return res.status(200).json({
        success: true,
        data: [],
        message:"No assignments found for this teacher"
      });
    }

    
    
    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      count: assignments.length,
      data: assignments
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch teacher assignments' });
  }
};


/* ================= GET LOGGED-IN TEACHER ASSIGNMENTS ================= */
exports.getMyAssignments = async (req, res) => {
  try {
    const assignments = await TeacherSubjectAssignment.find({
      teacher: req.user.linkedId,
      isActive: true
    })
      .populate('subject', 'subjectName')
      .populate('classRef', 'className')
      .populate('section', 'sectionName');

    res.status(200).json({
      success: true,
      data: assignments
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch assignments' });
  }
};


//Instead of deleting deactivating here to protect the attendance history

exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await TeacherSubjectAssignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    assignment.isActive = false;
    await assignment.save();

    res.status(200).json({
      success: true,
      message: 'Assignment deactivated successfully'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to delete assignment' });
  }
};