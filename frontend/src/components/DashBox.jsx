"use client";

export default function DashBox({title,value,icon,color}){

    return (
    <div className={`bg-white p-6 rounded-xl shadow border-l-4 ${color} relative overflow-hidden hover:shadow-lg transition`}>
      <div className="absolute right-4 top-4 opacity-20">
        {icon}
      </div>
      <p className="text-gray-600 text-sm font-medium">{title}</p>
      <h3 className="text-3xl font-bold text-gray-900 mt-2">
        {value}
      </h3>
    </div>
  );


}