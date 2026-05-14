'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { 
  LogOut, 
  MapPin, 
  Clock, 
  ClipboardList, 
  CheckCircle2, 
  User, 
  ChevronRight,
  Search
} from 'lucide-react';

export default function EngineerDashboard() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuthStore();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'engineer')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const assignedCases = [
    {
      id: '1',
      applicant: 'Amit Sharma',
      bank: 'ICICI Bank',
      address: '102, Shanti Vihar Apartments, Satellite, Ahmedabad',
      status: 'ALLOCATED',
      priority: 'High'
    },
    {
      id: '2',
      applicant: 'Priya Patel',
      bank: 'HDFC Bank',
      address: 'B-405, Safal Parisar, South Bopal, Ahmedabad',
      status: 'VISIT_STARTED',
      priority: 'Medium',
      hasQuery: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      {/* Premium Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg sticky top-0 z-30 px-6 py-4 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Field Engineer</p>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Active Tasks</h1>
        </div>
        <button 
          onClick={handleLogout} 
          className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl transition-active active:scale-90"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </header>

      <main className="px-6 py-6 space-y-6">
        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search your assigned cases..." 
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 rounded-2xl border-none shadow-sm shadow-gray-200 dark:shadow-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
          />
        </div>

        {/* Case Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Assigned Cases</h2>
            <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 text-[10px] font-black px-2 py-1 rounded-lg">
              {assignedCases.length} PENDING
            </span>
          </div>

          <div className="space-y-4">
            {assignedCases.map((item) => (
              <div 
                key={item.id} 
                className="bg-white dark:bg-gray-900 p-5 rounded-3xl shadow-sm border border-gray-50 dark:border-gray-800/50 active:scale-[0.98] transition-all relative overflow-hidden"
                onClick={() => router.push(`/engineer/visit/${item.id}`)}
              >
                {item.hasQuery && (
                  <div className="absolute top-0 right-0 px-3 py-1 bg-red-600 text-white text-[8px] font-black uppercase tracking-tighter rounded-bl-xl shadow-lg">
                    Action Required
                  </div>
                )}
                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                      {item.bank}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.applicant}</h3>
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                    item.status === 'ALLOCATED' 
                      ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' 
                      : 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {item.status.replace('_', ' ')}
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-500" />
                  <p className="line-clamp-2 leading-relaxed">{item.address}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                  <div className="flex items-center gap-1 text-xs font-semibold text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span>Added 2h ago</span>
                  </div>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                    Open Details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Floating Bottom Nav */}
      <nav className="fixed bottom-6 left-6 right-6 h-18 bg-gray-900/90 dark:bg-white/10 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/10 flex justify-around items-center px-4 z-40">
        <button 
          onClick={() => router.push('/engineer')}
          className={`p-3 rounded-2xl ${router.pathname === '/engineer' ? 'text-white bg-blue-600' : 'text-gray-400'}`}
        >
          <ClipboardList className="h-6 w-6" />
        </button>
        <button 
          onClick={() => router.push('/engineer/map')}
          className={`p-3 rounded-2xl ${router.pathname === '/engineer/map' ? 'text-white bg-blue-600' : 'text-gray-400'}`}
        >
          <MapPin className="h-6 w-6" />
        </button>
        <button className="p-3 text-gray-400 hover:text-white transition-colors">
          <User className="h-6 w-6" />
        </button>
      </nav>
    </div>
  );
}
