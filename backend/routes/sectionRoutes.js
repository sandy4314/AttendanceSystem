const sectionController=require('../controllers/sectionController');
const authMiddleware=require('../middleware/authMiddleware');
const express=require('express');

const router=express.Router();

router.use(authMiddleware.protect);

router.route('/')
.post(authMiddleware.restrictTo('admin','branchadmin'),sectionController.createSection)
.get(sectionController.getSections);

router.get('/all',authMiddleware.restrictTo('admin'),sectionController.getAllSections);

router.get('/class/:classId',sectionController.getSectionsByClass)

router.get('/my-incharge',authMiddleware.restrictTo('teacher'),sectionController.getMyInchargeSections);
router.route('/:id')
.get(sectionController.getSectionById)
.put(sectionController.updateSection)
.delete(sectionController.deleteSection);

router.get('/my-incharge',authMiddleware.restrictTo('teacher'),sectionController.getMyInchargeSections);
module.exports=router;