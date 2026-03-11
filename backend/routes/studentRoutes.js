const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const studentController = require('../controllers/studentController');

router.use(authMiddleware.protect);

router.post('/', authMiddleware.restrictTo('admin','branchadmin'), studentController.createStudent);
router.post("/bulk", studentController.createMultipleStudents);
router.get('/all', authMiddleware.restrictTo('admin'), studentController.getAllStudents);
router.get('/', authMiddleware.restrictTo('admin','branchadmin'), studentController.getStudents);

router.get('/class/:classId', authMiddleware.restrictTo('admin','branchadmin'), studentController.getStudentsByClass);
router.get('/section/:sectionId', authMiddleware.restrictTo('admin','teacher','branchadmin'), studentController.getStudentsBySection);

// Dynamic routes - these should come last
router.route('/:id')
  .get(authMiddleware.restrictTo('admin','student','branchadmin'), studentController.getStudentById)
  .put(authMiddleware.restrictTo('admin','branchadmin'), studentController.updateStudent)
  .delete(authMiddleware.restrictTo('admin','branchadmin'), studentController.deleteStudent);

module.exports = router;