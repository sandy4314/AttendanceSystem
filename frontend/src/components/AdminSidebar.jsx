'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {LayoutDashboard,Building,BookOpen,Layers,Users,GraduationCap,Grid,BookMarked,LogOut} from 'lucide-react';

function SidebarItem({ icon, label, href, isActive }) {
  return (
    <Link href={href}>
      <div
        className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition ${
          isActive
            ? 'bg-amber-500 text-white'
            : 'hover:bg-gray-700 text-gray-300'
        }`}
      >
        {icon}
        {label}
      </div>
    </Link>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    
  await fetch('http://localhost:5000/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });

  router.push('/');
};
 
  const menuItems = [
    { href: '/admin-dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { href: '/admin-dashboard/branches', icon: <Building size={20} />, label: 'Branches' },
    { href: '/admin-dashboard/classes', icon: <BookOpen size={20} />, label: 'Classes' },
    { href: '/admin-dashboard/sections', icon: <Layers size={20} />, label: 'Sections' },
    { href: '/admin-dashboard/students', icon: <GraduationCap size={20} />, label: 'Students' },
    { href: '/admin-dashboard/teachers', icon: <Users size={20} />, label: 'Teachers' },
    { href: '/admin-dashboard/subjects', icon: <BookOpen size={20} />, label: 'Subjects' },
    { href: '/admin-dashboard/assignbranch', icon: <BookMarked size={20} />, label: 'Assign Branch' },
    
  ];

  return (
    <div className="fixed top-0 left-0 w-64 h-screen bg-[#0f172a] text-white flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold">SL</h1>
        <p className="text-sm text-gray-400">Admin Portal</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isActive={pathname === item.href}
          />
        ))}
      </nav>

      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}