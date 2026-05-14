'use client';

import { useAuthStore } from '@/store/authStore';
import { Briefcase, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuthStore();

  const stats = [
    { name: 'Total Cases', value: '128', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { name: 'Pending Assignment', value: '12', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { name: 'Ready for Review', value: '8', icon: AlertCircle, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { name: 'Completed Today', value: '24', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name}</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Here's what's happening with your valuation operations today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md">
            <div className="flex items-center">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Cases</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Applicant</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Bank</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Engineer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Rajesh Kumar</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">HDFC Bank</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">ALLOCATED</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Amit S.</td>
                </tr>
                {/* More rows... */}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Active Engineers</h3>
          <div className="space-y-4">
            {[
              { name: 'Amit Sharma', status: 'In Field', cases: 5 },
              { name: 'Vijay Patel', status: 'At Office', cases: 2 },
              { name: 'Sanjay Shah', status: 'In Field', cases: 4 },
            ].map((eng) => (
              <div key={eng.name} className="flex items-center justify-between p-3 rounded-xl border border-gray-50 dark:border-gray-700">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{eng.name}</p>
                  <p className="text-xs text-gray-500">{eng.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-600">{eng.cases} cases</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
