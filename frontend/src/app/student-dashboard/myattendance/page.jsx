'use client';

import { useState, useEffect } from 'react';
// import { apiRequest } from '../../services/api';
import { useRouter } from 'next/navigation';
import { User, Phone, BookOpen, Users } from 'lucide-react';
import Layout from '@/components/Layout';
import { apiRequest } from '@/services/api';


export default function MyAttendance(){
    const [data,setData]=useState([]);
    const [userid,setUserId]=useState('');
    const [uniquedates,setUniqueDates]=useState([]);
    const [newdata,setNewData]=useState({})

    
     
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        console.log(user?.linkedId);
        setUserId(user.linkedId);
    
    }, []);

    
    useEffect(()=>{

        if(userid){
            GetAttendance();
        }

    },[userid]);

    const GetAttendance=async()=>{
        try
        {
        const attendance=await apiRequest(`/attendance/student/${userid}`);
        setData(attendance.data);
        
        
        }
        catch(err){
            console.error("failed to fetch attendance");
        }

    }



    const uniqueTimeSlots = [

            "09:00-09:45",
            "09:45-10:30",
            "10:45-11:30",
            "11:30-12:15",
            "13:15-14:00",
            "14:00-14:45",
            "15:00-15:45",
            "15:45-16:30"
];


   
   useEffect(()=>{

       
        if(!data) return ;
        const dates=[...new Set(data.map(d=>d.date.split('T')[0]))];
        setUniqueDates(dates);

        const formatedData=data.map(d=>{
            const formatDate=d.date.split('T')[0];

            return {
                        ...d,
                        formatDate
                    }
            })
            
            const griddata={};

            dates.forEach(date=>{
                griddata[date]={};

                uniqueTimeSlots.forEach(slot=>{
                    griddata[date][slot]='-';

                });
            });

            

            formatedData.forEach(d=>{

                griddata[d.formatDate][d.timeSlot]=`${d.status} - ${d.subjectName}`

            })

            setNewData(griddata);

           
   },[data]) 

    
    return(
    <Layout>
    <div>


                <div className="p-6">
                    
                    
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                        My Attendance
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 text-sm text-center">
                        
                        <thead className="bg-gray-100">
                            <tr>
                            <th className="px-4 py-3 border font-semibold text-gray-700">
                                Date
                            </th>
                            {uniqueTimeSlots.map((slot) => (
                                <th
                                key={slot}
                                className="px-4 py-3 border font-semibold text-gray-700"
                                >
                                {slot}
                                </th>
                            ))}
                            </tr>
                        </thead>

                        <tbody>
                            {uniquedates.length>0 && (uniquedates.map((date) => {
                            

                            return (
                                <tr key={date} className="hover:bg-gray-50">
                                
                                <td className="px-4 py-3 border font-medium text-gray-700 bg-gray-50">
                                    {date}
                                </td>

                                {uniqueTimeSlots.map((slot) => {
                                    const value = newdata[date]?.[slot] || "-";

                                    let cellStyle =
                                    "px-4 py-3 border text-gray-600";

                                    if (value.startsWith("P"))
                                    cellStyle =
                                        "px-4 py-3 border bg-green-100 text-green-700 font-semibold";

                                    if (value.startsWith("A"))
                                    cellStyle =
                                        "px-4 py-3 border bg-red-100 text-red-700 font-semibold";

                                    return (
                                    <td key={slot} className={cellStyle}>
                                        {value}
                                    </td>
                                    );
                                })}
                                </tr>
                            );
                            })
                        )}
                        </tbody>

                        </table>
                    

                    
                    <div className="flex gap-6 mt-6 text-sm">
                        <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-100 border rounded"></div>
                        <span className="text-gray-600">Present</span>
                        </div>
                        <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-100 border rounded"></div>
                        <span className="text-gray-600">Absent</span>
                        </div>
                    </div>

                    </div>
                </div>        

            </div>
            
            
        </Layout>
        
    );





}