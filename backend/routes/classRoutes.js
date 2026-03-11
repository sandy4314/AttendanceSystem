const classController=require('../controllers/classController');
const authMiddleware=require('../middleware/authMiddleware');
const express=require('express');
const router=express.Router();

router.use(authMiddleware.protect);

router.post('/',authMiddleware.restrictTo('admin','branchadmin'),classController.createClass);
router.get('/',authMiddleware.restrictTo('admin','branchadmin'),classController.getClasses);
router.get('/all',authMiddleware.restrictTo('admin'),classController.getAllClasses);
router.get('/branch/:branchId',authMiddleware.restrictTo('admin','branchadmin'),classController.getClassesByBranch);
router.route('/:id',authMiddleware.restrictTo('admin','branchadmin'))
.put(classController.updateClass)
.get(classController.getClassById)
.delete(classController.deleteClass);




module.exports=router
