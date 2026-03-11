const express=require('express');
const router=express.Router();

const tsaController=require('../controllers/TeacherSubjectAssignController');
const authMiddleware=require('../middleware/authMiddleware');


router.use(authMiddleware.protect);

// Admin only routes
router.post('/', authMiddleware.restrictTo('admin','branchadmin'), tsaController.createAssignment);
router.get('/all', authMiddleware.restrictTo('admin'), tsaController.getAllAssignments);
router.get('/', authMiddleware.restrictTo('admin','branchadmin'), tsaController.getAssignments);

// Delete assignment (admin only)
router.delete('/:id', authMiddleware.restrictTo('admin','branchadmin'), tsaController.deleteAssignment);

// Teacher specific routes
router.get('/me', tsaController.getMyAssignments);
router.get('/teacher/:teacherId', tsaController.getAssignmentsByTeacher);

module.exports = router;


