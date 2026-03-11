const Branch=require('../models/Branch');
const Teacher=require('../models/Teacher');
const Class=require('../models/Class');

exports.createClass=async(req,res)=>{
    const {className,branchId,teacherId}=req.body;
    try
    {
        const existingBranch=await Branch.findById(branchId);
        if(!existingBranch){
            return res.status(404).json({
                success:false,
                message:"Branch not found"
            });
        }
        
        const existingTeacher=await Teacher.findById(teacherId);
        if(!existingTeacher){
            return res.status(404).json({
                success:false,
                message:"Teacher not found"
            });
        }

        const existingClass = await Class.findOne({
                branch: branchId,
                className
            });

        if (existingClass) {
        return res.status(400).json({
            success: false,
            message: 'Class already exists in this branch'
        });
        }

        const newClass= await Class.create({
            branch:branchId,
            className,
            classIncharge:teacherId
        });

        

        res.status(201).json({
            success:true,
            message:"Class Created Successfully",
            data:newClass
        });

    }
    catch(err){
        console.error(err);
        res.status(500).json({
            success:false,
            message:"Error in creating Class"
        });
    }
}

exports.getAllClasses = async (req,res)=>{
  try
  {
    const classes=await Class.find()
    .sort({createdAt:-1})
    if(!classes){
      return res.status(201).json({
        success:true,
        message:"No classes found",
        data:[]
      });
    }

    res.status(201).json({
      success:true,
      message:"Classes fetched successfully",
      data:classes
    });


  }catch(err){
    console.error(err);
    res.status(500).json({
      success:false,
      message:"server error Failed to fetch classes"
    });
  }
}

exports.getClasses = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const branchId = req.query.branchId;

    const search=req.query.search;

    const skip = (page - 1) * limit;

    let filter = {};

    // filter by branch if provided
    if (branchId && branchId !== "all") {
      filter.branch = branchId;
    }

    if (search) {
          filter.className = { $regex: search, $options: "i" };
        }



    const total = await Class.countDocuments(filter);

    const classes = await Class.find(filter)
      .populate("branch", "branchName")
      .populate("classIncharge", "fullName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    
    if (classes.length === 0) {
        return res.status(200).json({
          success: true,
          page,
          limit,
          total: 0,
          totalPages: 0,
          count: 0,
          data: []
        });
    }

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      count: classes.length,
      data: classes
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch classes"
    });
  }
};


exports.getClassesByBranch = async (req, res) => {
  try {
    const limit=parseInt(req.query.limit) || 100;
    const classes = await Class.find({ branch: req.params.branchId })
      .populate('classIncharge', 'fullName')
      .limit(limit);

    res.status(200).json({
      success: true,
      count: classes.length,
      data:classes
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch classes'
    });
  }
};


exports.getClassById = async(req,res)=>{

    try{
        const cls=await Class.findById(req.params.id)
        .populate('branch','branchName')
        .populate('classIncharge','fullName');

        if(!cls){
            return res.status(404).json({
                success:false,
                message:"class not found"
            });
        }
        res.status(200).json({
            success:true,
            data:cls
        });

    }
    catch(err){
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch class'
        })
    }

}


exports.updateClass = async (req, res) => {
  const { className, teacherId } = req.body;
  
  try {

    const currentcls=await Class.findById(req.params.id);
    
    if (!currentcls) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }
    

    if (className) {
      const duplicateClass = await Class.findOne({
        branch: currentcls.branch,
        className,
        _id: { $ne: currentcls._id } // exclude self
      });
    

      if(duplicateClass){
        
        return res.status(400).json({
          success:false,
          message:"Class name already exists in the branch"
        });

      }
    

    
    // validate incharge if provided
    if (teacherId) {
      const teacher = await Teacher.findById(teacherId);
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }
    }
    
    currentcls.className=className || currentcls.className;
    currentcls.classIncharge = teacherId || currentcls.classIncharge;

    await currentcls.save();


    

    res.status(200).json({
      success: true,
      message: 'Class updated successfully',
      data:currentcls
    });

  } 
}
catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to update class'
    });
  }
};


exports.deleteClass = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id);

    if (!cls) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }
    
    await cls.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Class deleted successfully'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete class'
    });
  }
};