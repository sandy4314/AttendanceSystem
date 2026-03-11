const express = require('express');
const router = express.Router();
const teacherController=require('../controllers/teacherController');
const authMiddleware=require('../middleware/authMiddleware')

router.use(authMiddleware.protect);

router.route('/')
.get(authMiddleware.restrictTo('admin','branchadmin'),teacherController.getTeachers)
.post(authMiddleware.restrictTo('admin','branchadmin'),teacherController.CreateTeacher);

router.get('/all',authMiddleware.restrictTo('admin',),teacherController.getAllTeachers);


router.route('/:id')
.get(authMiddleware.restrictTo('teacher','admin'),teacherController.getOneTeacher)
.put(authMiddleware.restrictTo('admin','branchadmin'),teacherController.updateTeacher)
.delete(authMiddleware.restrictTo('admin'),teacherController.deleteTeacher);



module.exports=router;
