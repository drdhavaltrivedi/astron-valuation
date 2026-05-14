'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { LayoutDashboard, Briefcase, Users, Building2, LogOut, Menu, X, IndianRupee } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Cases', href: '/admin/cases', icon: Briefcase },
    { name: 'Billing', href: '/admin/billing', icon: IndianRupee },
    { name: 'Banks', href: '/admin/banks', icon: Building2 },
    { name: 'Users', href: '/admin/users', icon: Users },
  ];

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/admin" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ASTRON
              </span>
            </Link>
            <div className="hidden md:ml-8 md:flex md:space-x-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                    }`}
                  >
                    <item.icon className={`mr-2 h-4 w-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</span>
            </div>
            <button
              onClick={() => logout()}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 animate-in slide-in-from-top duration-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center px-4">
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800 dark:text-white">{user?.name}</div>
                <div className="text-sm font-medium text-gray-500">{user?.email}</div>
              </div>
            </div>
            <div className="mt-3 px-2">
              <button
                onClick={() => logout()}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
