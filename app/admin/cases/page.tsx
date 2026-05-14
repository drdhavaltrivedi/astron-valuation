'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Plus, Search, Filter, MoreHorizontal, FileText, UserPlus, MapPin } from 'lucide-react';

export default function CasesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const [cases, setCases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCases();
  }, []);

  async function fetchCases() {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select(`
          *,
          banks (name),
          users:assigned_engineer_id (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCases(data || []);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      NEW: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      ALLOCATED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      VISIT_STARTED: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      FORM_SUBMITTED: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
      COMPLETED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Case Management</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage and track property valuation requests.</p>
        </div>
        <Link href="/admin/cases/new">
          <Button icon={Plus}>Create New Case</Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by applicant, address or ID..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" icon={Filter} size="md">Filter</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Case Info</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bank</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Engineer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">Loading cases...</td></tr>
              ) : cases.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">No cases found.</td></tr>
              ) : (
                cases.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{item.applicant_name}</span>
                        <span className="text-xs text-gray-500">ID: {item.application_id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                        {item.address}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.banks?.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      {item.users?.name ? (
                        <div className="flex items-center text-sm text-gray-900 dark:text-white">
                          <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2 text-[10px] font-bold text-blue-600">
                            {item.users.name.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          {item.users.name}
                        </div>
                      ) : (
                        <button className="flex items-center text-xs text-blue-600 font-semibold hover:underline">
                          <UserPlus className="h-3 w-3 mr-1" />
                          Assign
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(item.status)}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Link href={`/admin/cases/${item.id}`}>
                          <Button variant="ghost" size="sm" icon={FileText}></Button>
                        </Link>
                        <Button variant="ghost" size="sm" icon={MoreHorizontal}></Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
