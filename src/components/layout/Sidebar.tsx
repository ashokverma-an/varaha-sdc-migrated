'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Hospital, 
  Users, 
  UserPlus, 
  FileText, 
  Calendar,
  Settings,
  LogOut
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Hospital },
  { name: 'Hospitals', href: '/hospitals', icon: Hospital },
  { name: 'Doctors', href: '/doctors', icon: Users },
  { name: 'Patient Registration', href: '/patients/new', icon: UserPlus },
  { name: 'Patient List', href: '/patients', icon: Users },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      <div className="flex h-16 shrink-0 items-center px-4">
        <h1 className="text-xl font-bold text-white">Hospital Management</h1>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                        isActive
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <item.icon className="h-6 w-6 shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
          <li className="mt-auto">
            <button className="group -mx-2 flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white">
              <LogOut className="h-6 w-6 shrink-0" />
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}