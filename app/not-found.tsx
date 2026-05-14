'use client';

import Link from 'next/link';
import { Home, AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-100 dark:bg-amber-900/30 mb-8">
          <AlertTriangle className="h-10 w-10 text-amber-600" />
        </div>
        <h1 className="text-6xl font-black text-slate-900 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Page Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
          The page you are looking for might have been moved, deleted, or does not exist.
        </p>
        <Link href="/login">
          <Button icon={Home} className="w-full py-4 shadow-xl shadow-blue-500/20">
            Back to Platform
          </Button>
        </Link>
      </div>
    </div>
  );
}
