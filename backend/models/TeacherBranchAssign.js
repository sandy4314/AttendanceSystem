const mongoose = require("mongoose");

const teacherBranchSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true
  },

  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

teacherBranchSchema.index({ teacher: 1, branch: 1 }, { unique: true });

module.exports = mongoose.model(
  "TeacherBranchAssignment",
  teacherBranchSchema
);