'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { Shield, Briefcase, HardHat, ChevronRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      /* 
      // Skipping Supabase Auth for now as per user request
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      */

      // Simple mock login: Fetch user profile directly from the users table by email
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (userError || !userData) {
        throw new Error('User not found in the platform database');
      }

      setUser(userData);

      // Redirect based on role
      if (userData.role === 'engineer') {
        router.push('/engineer');
      } else {
        router.push('/admin');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: string) => {
    setLoading(true);
    setError('');
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('role', role)
        .limit(1)
        .single();

      if (userError || !userData) {
        throw new Error(`No demo user found for role: ${role}`);
      }

      setUser(userData);
      if (userData.role === 'engineer') {
        router.push('/engineer');
      } else {
        router.push('/admin');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="max-w-md w-full">
        {/* Brand Logo & Header */}
        <div className="text-center mb-10">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-500/20 mb-6">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            ASTRON
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium uppercase tracking-[0.2em] text-[10px]">
            Valuation Operations Platform
          </p>
        </div>

        {/* Demo Selection Card */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-800">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Demo Access</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Select your role to continue to the dashboard.</p>
          </div>

          <div className="space-y-4">
            {[
              { id: 'super_admin', label: 'Super Admin', icon: Shield, color: 'indigo' },
              { id: 'admin', label: 'Operations Admin', icon: Briefcase, color: 'slate' },
              { id: 'engineer', label: 'Field Engineer', icon: HardHat, color: 'blue' }
            ].map((role) => (
              <button
                key={role.id}
                onClick={() => handleQuickLogin(role.id)}
                disabled={loading}
                className="group w-full flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-600 dark:hover:bg-indigo-600 transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-700 shadow-sm group-hover:bg-white/20 group-hover:text-white transition-colors">
                    <role.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400 group-hover:text-white" />
                  </div>
                  <span className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-white transition-colors">
                    {role.label}
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30">
              <p className="text-xs font-bold text-red-600 dark:text-red-400 text-center">{error}</p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <p className="mt-10 text-center text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">
          &copy; 2026 Astron Consulting Services &bull; Enterprise Edition
        </p>
      </div>
    </div>
  );
}
