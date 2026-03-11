
const TeacherBranchAssign= require('../models/TeacherBranchAssign');
const Branch=require('../models/Branch');

const Teacher=require('../models/Teacher');


exports.createTeacherBranchAssign= async (req,res)=>{

    try
    {
        const {branch,teacher}=req.body;
        const branchExists = await Branch.findById(branch);
        if (!branchExists) return res.status(404).json({ success: false, message: 'Branch not found' });


        const teacherExists = await Teacher.findById(teacher);
        if (!teacherExists) return res.status(404).json({ success: false, message: 'Teacher not found' });
        
        const existing = await TeacherBranchAssign.findOne({
            branch,
            teacher,
            isActive:true
        });

        if(existing){
            
            return res.status(400).json({
                success: false,
                message: 'Assignment already exists'
            });

        }

    const assignment=await TeacherBranchAssign.create({
        branch,
        teacher
    });
    

    res.status(201).json({
      success: true,
      message: 'Teacher  assigned to branch successfully',
      data: assignment
    });

  } catch (err) {
    console.error(err);

   if (err.code === 11000) {
      return res.status(400).json({
         success:false,
         message:"Teacher already assigned to this branch"
      });
   }
}

};

exports.getTeachersByBranchId = async(req,res)=>{
    try
    {
        const limit=parseInt(req.query.limit) || 5;
        const page=parseInt(req.query.page) || 1;
        const search=req.query.search;

        let matchStage = { isActive: true };

        const branchId=req.params.branchId;
        

        if (branchId && branchId !== "all") {
          matchStage.branch = branchId;
        }

        if (search) {

          const searchNumber = Number(search);

          const teachers = await Teacher.find({
            $or: [
              { fullName: { $regex: search, $options: "i" } },
              { phone: { $regex: search, $options: "i" } },
              ...(isNaN(searchNumber) ? [] : [{ salary: searchNumber }])
            ]
          }).select("_id");

          const teacherIds = teachers.map(t => t._id);

          matchStage.teacher = { $in: teacherIds };

        }

        const skip =(page-1)*limit;

        const total=await TeacherBranchAssign.countDocuments(matchStage);

        const teachers = await TeacherBranchAssign.find(matchStage)
        .populate('teacher','fullName salary phone createdAt updatedAt')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
        
        
        if(teachers.length === 0){
            return res.status(404).json({
                success:true,
                message:"Not Found Teachers"
            });
        }

        res.status(200).json({
            success:true,
            message:"Successfully fetched Teachers",
            limit,
            total,
            skip,
            totalPages:Math.ceil(total/limit),
            data:teachers
        });



    }catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to Get Teachers' });
  }
}



exports.getBranchesByTeacherId = async(req,res)=>{
    try
    {
        const teacher=req.params.teacherId;
        
        const teacherExists = await Teacher.findById(teacher);
        if (!teacherExists) return res.status(404).json({ success: false, message: 'Teacher not found' });

        const branches = await TeacherBranchAssign.find({
                teacher: teacher,
                isActive: true
            })
            .populate('branch','branchName location')
            .sort({ createdAt: -1 });

        if(!branches){
            return res.status(404).json({
                success:true,
                message:"Not Found Teachers"
            });
        }

        res.status(200).json({
            success:true,
            message:"Successfully fetched Teachers",
            data:branches
        });



    }catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to get Branches' });
  }
}

exports.getAssignments= async (req, res)=>{
  try
  {
    const limit=parseInt(req.query.limit) || 5;
    const page=parseInt(req.query.page) || 1;
    const search=req.query.search;

    let matchStage = { isActive: true };

    const branchId=req.query.branch;
    

    if (branchId && branchId !== "all") {
      matchStage.branch = branchId;
    }

    if (search) {

      const teachers = await Teacher.find({
        fullName: { $regex: search, $options: "i" }
      }).select("_id");

      const teacherIds = teachers.map(t => t._id);

      matchStage.teacher = { $in: teacherIds };

    }

    const skip =(page-1)*limit;

    const total=await TeacherBranchAssign.countDocuments(matchStage);

    const assignments=await TeacherBranchAssign.find(matchStage)
    .populate('branch','branchName location')
    .populate('teacher','fullName')
    .sort({createdAt:-1})
    .limit(limit)
    .skip(skip)

    if(assignments.length === 0){
      return res.status(200).json({
        success:true,
        message:"No assignments were found",
        data:[]
      });

    }

    res.status(200).json({
      success:true,
      message:"Assignments fetched successfully",
      limit,
      total,
      totalPages:Math.ceil(total/limit),
      data:assignments
    });





  }catch(err){
    console.error(err);
    res.status(500).json({success:false,message:"Failed to fetch Attendance"});

  }
}
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await TeacherBranchAssign.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    assignment.isActive = false;
    await assignment.save();

    res.status(200).json({
      success: true,
      message: 'Assignment deactivated successfully'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to deactivate assignment' });
  }
};




exports.getAllTeachers = async(req,res)=>{
  try
  {

    const branchId=req.query.branch;

    const teachers= await TeacherBranchAssign.find({
      branch:branchId,
      isActive:true
    })
    .populate("teacher", "fullName phone");

    if(teachers.length==0){
      return res.status(200).json({
        success:true,
        message:"No data found",
        data:[]
      });
    }

    res.status(200).json({
      success:true,
      data:teachers,
      message:"Data fetched successfully"
    })
  }catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to deactivate assignment' });
  }
}