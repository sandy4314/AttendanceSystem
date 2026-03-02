const express=require('express');
const router=express.Router();



const authMiddleware=require('../middleware/authMiddleware');

const attendanceController=require('../controllers/attendanceController');


router.use(authMiddleware.protect);

router.post('/',authMiddleware.restrictTo('teacher'),attendanceController.markAttendance);

router.get(
  "/session",
  authMiddleware.restrictTo("teacher"),
  attendanceController.getAttendanceBySession
);

router.put('/:attendanceId',
  authMiddleware.restrictTo('teacher'),
  attendanceController.updateAttendance
);




router.get('/student/:studentId',attendanceController.getStudentAttendance);






module.exports=router;