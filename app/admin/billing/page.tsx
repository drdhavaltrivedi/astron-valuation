'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  IndianRupee, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Filter, 
  Download,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const chartData = [
  { name: 'Jan', revenue: 45000 },
  { name: 'Feb', revenue: 52000 },
  { name: 'Mar', revenue: 48000 },
  { name: 'Apr', revenue: 61000 },
  { name: 'May', revenue: 84500 },
];

export default function BillingPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const billingEntries = [
    { id: '1', applicant: 'Rajesh Kumar', bank: 'ICICI Bank', amount: 2500, status: 'paid', date: '14 May 2026' },
    { id: '2', applicant: 'Sunit Patel', bank: 'HDFC Bank', amount: 3200, status: 'invoiced', date: '13 May 2026' },
    { id: '3', applicant: 'Meera Shah', bank: 'Axis Bank', amount: 2800, status: 'pending', date: '12 May 2026' },
    { id: '4', applicant: 'Amit Verma', bank: 'Kotak Bank', amount: 2500, status: 'paid', date: '10 May 2026' },
  ];

  const stats = [
    { name: 'Total Revenue', value: '₹ 84,500', trend: '+12.5%', isUp: true },
    { name: 'Pending Payments', value: '₹ 12,200', trend: '-2.4%', isUp: false },
    { name: 'Paid Cases', value: '32', trend: '+4.1%', isUp: true },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Billing & Revenue</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Track your bank-wise payments and financial performance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
              stat.isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            }`}>
              {stat.isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {stat.trend}
            </div>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card className="p-6">
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Revenue Trends (6 Months)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#94a3b8' }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                tickFormatter={(value) => `₹${value/1000}k`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#2563eb" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRev)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Main Billing Table */}
      <Card className="overflow-hidden p-0">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-4 justify-between bg-gray-50/50 dark:bg-gray-800/50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by applicant or bank..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" icon={Filter}>Filter</Button>
            <Button icon={Download}>Export MIS</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
            <thead className="bg-gray-50/50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Case Info</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Bank</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {billingEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{entry.applicant}</p>
                    <p className="text-[10px] text-gray-500">ID: VAL-{entry.id}092</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{entry.bank}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center font-black text-gray-900 dark:text-white text-sm">
                      <IndianRupee className="h-3 w-3 mr-0.5" />
                      {entry.amount}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      entry.status === 'paid' 
                        ? 'bg-green-50 text-green-600 dark:bg-green-900/20' 
                        : entry.status === 'invoiced'
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                        : 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20'
                    }`}>
                      {entry.status === 'paid' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {entry.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">{entry.date}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm">Update</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
