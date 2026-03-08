const Teacher=require('../models/Teacher');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.CreateTeacher=async (req,res)=>{
    const {fullName,salary,phone,username,password}=req.body;
    
    const session= await mongoose.startSession();
    session.startTransaction();


    try{

        const existingUser= await User.findOne({username}).session(session);
        if(existingUser)
        {
            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                success:false,
                message:"username already exists"
            });
        }
        
    const teacher=await Teacher.create([{
        fullName,
        salary,
        phone
    }],
{session});

    const user=await User.create([{
        name:fullName,
        username,
        password,
        role:'teacher',
        linkedId:teacher[0]._id

    }],
    
    {session}
);
    
    teacher[0].user=user[0]._id;
    await teacher[0].save({session});


    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
        success:true,
        message:'Teacher created successfully',
        data:teacher[0]
    })


}    catch(err){

    await session.abortTransaction();
    session.endSession();

    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to create teacher'
    });

}

}

exports.updateTeacher=async (req,res)=>{
    const {fullName,salary,phone}=req.body;
    try{
        const teacher=await Teacher.findByIdAndUpdate(req.params.id,
            {fullName,salary,phone},
            {new:true}
        );
        if(!teacher){
            return res.status(404).json({message:"Teacher not found"});
        }
        res.json(teacher);
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Server Error"});
    }

}

exports.deleteTeacher=async (req,res)=>{

    const session = await mongoose.startSession();
    session.startTransaction();
    
    try
    {
        const teacher=await Teacher.findById(req.params.id).session(session);
        if(!teacher){
            await session.abortTransaction();
            session.endSession();

            return res.status(404).json({
                success:false,
                message:"Teacher not found"
            });

        }
        await User.findOneAndDelete({linkedId:req.params.id}).session(session);

        await Teacher.findByIdAndDelete(req.params.id).session(session);


        await session.commitTransaction();
        session.endSession();

        res.status(200).json({

            
            success:true,
            message:"Teacher and their credentials are deleted successfully"
        });
    }catch(err){
        await session.abortTransaction();
        session.endSession();
        console.error(err);
        res.status(500).json({
            success:false,
            message:'server error'
        });

    }

}

exports.getOneTeacher=async (req,res)=>{

    try{
        const teacher=await Teacher.findById(req.params.id);
        if(!teacher){
            res.status(404).json({
                success:false,
                message:"check the teacher id"
            });
        }
        res.json(teacher);


    }catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getAllTeachers= async(req,res)=>{
    try
    {
        const teachers=await Teacher.find().sort({createdAt: -1})
        if(!teachers){
            return res.status(404).json({
                success:true,
                message:"No Teachers Found"
            });
        }
        
        res.status(201).json({
            success:true,
            message:"",
            data:teachers
        });
    }catch(err){
        console.error(err);
        res.status(500).json({message:'server error'});
    }
}


exports.getTeachers =async(req,res)=>{
    try
    {
        const page=parseInt(req.query.page) || 1;
        const limit=parseInt(req.query.limit) || 5;

        const search=req.query.search;

        const skip=(page-1)*limit;

        

        let filter={};
        
        if(search){
            filter.$expr = {
                $or: [
                    { $regexMatch: { input: "$fullName", regex: search, options: "i" } },
                    { $regexMatch: { input: "$phone", regex: search, options: "i" } },
                    { $regexMatch: { input: { $toString: "$salary" }, regex: search } }
                ]
                };


    }
        const total= await Teacher.countDocuments(filter);

        const teachers= await Teacher.find(filter)
        .limit(limit)
        .sort({createdAt:-1})
        .skip(skip);

        res.status(200).json({
            success: true,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            count: teachers.length,
            data: teachers
        });

    }catch(err){

        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch Teachers"
            });


    }
}




