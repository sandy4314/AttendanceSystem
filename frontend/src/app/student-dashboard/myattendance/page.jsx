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
    const [newdata,setNewData]=useState({});
    const [year,setYear]=useState('');
    const [month,setMonth]=useState('');

    const years=[2025,2026];
    const months = [
            { name: "Jan", value: 1 },
            { name: "Feb", value: 2 },
            { name: "Mar", value: 3 },
            { name: "Apr", value: 4 },
            { name: "May", value: 5 },
            { name: "Jun", value: 6 },
            { name: "Jul", value: 7 },
            { name: "Aug", value: 8 },
            { name: "Sep", value: 9 },
            { name: "Oct", value: 10 },
            { name: "Nov", value: 11 },
            { name: "Dec", value: 12 }
            ];

    
     
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        console.log(user?.linkedId);
        setUserId(user.linkedId);
    
    }, []);

    
    useEffect(()=>{

        if(userid && year && month){
            GetAttendance();
        }

    },[userid,year,month]);

    

    const GetAttendance=async()=>{
        try
        {
       
        const attendance = await apiRequest(
        `/attendance/student/${userid}?year=${year}&month=${month}`
        );

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
                    
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                        My Attendance
                    </h2>
                    

                    <div className="flex flex-wrap items-center gap-4 mb-6">

                    {/* Year Select */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-600 mb-1">Year</label>
                        <select
                        className="px-4 py-2 border rounded-lg bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        value={year}
                        onChange={(e)=>setYear(e.target.value)}
                        >
                        <option value="">Select Year</option>
                        {years.map((y)=>(
                            <option key={y} value={y}>{y}</option>
                        ))}
                        </select>
                    </div>

                    {/* Month Select */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-600 mb-1">Month</label>
                        <select
                        className="px-4 py-2 border rounded-lg bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        value={month}
                        onChange={(e)=>setMonth(e.target.value)}
                        >
                        <option value="">Select Month</option>
                        {months.map((m)=>(
                            <option key={m.value} value={m.value}>{m.name}</option>
                        ))}
                        </select>
                    </div>

                    </div>
                    </div>


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