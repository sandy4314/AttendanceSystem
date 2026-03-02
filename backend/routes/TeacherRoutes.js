const express = require('express');
const router = express.Router();
const teacherController=require('../controllers/teacherController');
const authMiddleware=require('../middleware/authMiddleware')

router.use(authMiddleware.protect);

router.route('/')
.get(authMiddleware.restrictTo('admin'),teacherController.getTeachers)
.post(authMiddleware.restrictTo('admin'),teacherController.CreateTeacher);


router.route('/:id')
.get(authMiddleware.restrictTo('teacher','admin'),teacherController.getOneTeacher)
.put(authMiddleware.restrictTo('admin'),teacherController.updateTeacher)
.delete(authMiddleware.restrictTo('admin'),teacherController.deleteTeacher);



module.exports=router;
