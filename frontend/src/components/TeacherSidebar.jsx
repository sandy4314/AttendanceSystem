'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Building,
  BookOpen,
  Layers,
  Users,
  GraduationCap,
  Grid,
  BookMarked,
  LogOut
} from 'lucide-react';

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

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const menuItems = [
    { href: '/teacher-dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { href: '/teacher-dashboard/markattendance', icon: <Building size={20} />, label: 'Mark Attendance' },
    { href: '/teacher-dashboard/myassigns', icon: <BookOpen size={20} />, label: 'My Assigns' },
  ];
  return (
    <div className="w-64 bg-[#0f172a] text-white flex flex-col justify-between">
      <div>
        <div className="p-6">
          <h1 className="text-xl font-bold">SL</h1>
          <p className="text-sm text-gray-400">Teacher Portal</p>
        </div>

        <nav className="space-y-2 px-4">
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
      </div>
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