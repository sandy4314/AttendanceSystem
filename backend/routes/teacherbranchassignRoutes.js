const express = require('express');
const router = express.Router();

const authMiddleware=require('../middleware/authMiddleware');
const tba=require('../controllers/teacherbranchassignController');

router.use(authMiddleware.protect);

router.post('/',authMiddleware.restrictTo('admin'),tba.createTeacherBranchAssign);
router.get('/',authMiddleware.restrictTo('admin'),tba.getAssignments);


router.get('/branch/:branchId',tba.getTeachersByBranchId);
router.get('/teacher/:teacherId',tba.getBranchesByTeacherId);

router.get('/all',tba.getAllTeachers);
router.delete('/:id',tba.deleteAssignment);

module.exports=router;