const Branch=require('../models/Branch');

exports.createBranch=async(req,res)=>{
    const {schoolName,branchName,location,status}=req.body;
    try
    {
        const existingBranch=await Branch.findOne({branchName:branchName})
        if(existingBranch){
            return res.status(400).json({
                success:false,
                message:"Branch already exists"
            })
        }
        const branch=await Branch.create({
            schoolName,
            branchName,
            location,
            status
        });

        await branch.save();
        res.status(201).json({
            success:true,
            data:branch,
            message:"Branch created successfully",
        });


}
catch(err){
    console.error(err);
    res.status(500).json({
        success:false,
        message:"error creating branch"
    });

}

}


exports.getBranches = async (req, res) => {
  try {

    // get page and limit from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    // skip calculation
    const skip = (page - 1) * limit;

    const search = req.query.search;

    const filter={}

    
      if(search){
            filter.$or = [
              { branchName: { $regex: search, $options: "i" } },
              { schoolName: { $regex: search, $options: "i" } },
              { location: { $regex: search, $options: "i" } }
            ];

    }
    // total count
    const total = await Branch.countDocuments(filter);

    

    // paginated data
    const branches = await Branch.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      count: branches.length,
      data: branches
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch branches"
    });
  }
};



exports.getAllBranches = async (req, res) => {
  try {

    const branches = await Branch.find({ status: "active" })
      .select("branchName schoolName")
      .sort({ branchName: 1 });

    res.status(200).json({
      success: true,
      count: branches.length,
      data: branches
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch branches"
    });
  }
};




exports.getBranchById= async(req,res)=>{
    try
    {
        const branch= await Branch.findById(req.params.id);
        if(!branch){

            return res.status(404).json({
            success: false,
            message: 'Branch not found'

        });

        }

        res.status(200).json({
            success:true,
            data:branch
        })
    }
    catch(err){
        console.error(err);
        res.status(500).json({
        success: false,
        message: 'Failed to fetch branch'
        });
    }
}

exports.updateBranch = async (req, res) => {
  const { schoolName, branchName, location ,status} = req.body;

  try {
    
    const existingBranch = await Branch.findOne({
      branchName: branchName,
      status: "active",
      _id: { $ne: req.params.id } // exclude current branch
    });

    if (existingBranch) {
      return res.status(400).json({
        success: false,
        message: "Branch name already exists",
      });
    }

    
    const branch = await Branch.findOneAndUpdate(
      { _id: req.params.id},
      { schoolName, branchName, location,status },
      { new: true }
    );

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found or inactive",
      });
    }

    res.status(200).json({
      success: true,
      message: "Branch updated successfully",
      data: branch,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to update branch",
    });
  }
};


exports.deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(
      req.params.id,
      { status: "inactive" },
      { new: true }
    );

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Branch deactivated successfully",
      data: branch,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to deactivate branch",
    });
  }
};


