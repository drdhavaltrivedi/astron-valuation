'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  Building2, 
  Search, 
  Plus, 
  MoreVertical, 
  ExternalLink,
  ShieldCheck,
  X,
  Trash2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Input from '@/components/ui/Input';

export default function BanksPage() {
  const [banks, setBanks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newBank, setNewBank] = useState({ name: '', code: '' });

  useEffect(() => {
    fetchBanks();
  }, []);

  async function fetchBanks() {
    try {
      const { data, error } = await supabase
        .from('banks')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      setBanks(data || []);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteBank(id: string) {
    if (!confirm('Are you sure you want to delete this bank? This might affect existing cases.')) return;
    
    try {
      const { error } = await supabase.from('banks').delete().eq('id', id);
      if (error) throw error;
      setBanks(banks.filter(b => b.id !== id));
    } catch (error) {
      console.error('Error deleting bank:', error);
      alert('Failed to delete bank. It might be referenced by existing cases.');
    }
  }

  async function saveBank() {
    if (!newBank.name || !newBank.code) return alert('Please fill all fields');
    setIsSaving(true);
    try {
      if (editingId) {
        const { data, error } = await supabase
          .from('banks')
          .update(newBank)
          .eq('id', editingId)
          .select()
          .single();
        
        if (error) throw error;
        setBanks(banks.map(b => b.id === editingId ? data : b));
      } else {
        const { data, error } = await supabase
          .from('banks')
          .insert([newBank])
          .select()
          .single();
        
        if (error) throw error;
        setBanks([...banks, data]);
      }
      setIsAddModalOpen(false);
      setEditingId(null);
      setNewBank({ name: '', code: '' });
    } catch (error) {
      console.error('Error saving bank:', error);
      alert('Failed to save bank. Code might be duplicate.');
    } finally {
      setIsSaving(false);
    }
  }

  function startEdit(bank: any) {
    setEditingId(bank.id);
    setNewBank({ name: bank.name, code: bank.code });
    setIsAddModalOpen(true);
  }

  const filteredBanks = banks.filter(bank => 
    bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bank.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Empanelled Banks</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Manage bank portals and specific report formats.</p>
        </div>
        <Button icon={Plus} onClick={() => setIsAddModalOpen(true)}>Add New Bank</Button>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search banks by name or code..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
            <thead className="bg-gray-50/50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Bank Name</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Code</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Portal Status</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">Loading banks...</td>
                </tr>
              ) : filteredBanks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">No banks found.</td>
                </tr>
              ) : (
                filteredBanks.map((bank) => (
                  <tr key={bank.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{bank.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono font-bold bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {bank.code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-green-600 text-xs font-bold">
                        <ShieldCheck className="h-4 w-4" />
                        Connected
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" icon={ExternalLink}>Portal</Button>
                        <button 
                          onClick={() => startEdit(bank)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => deleteBank(bank.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Bank Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{editingId ? 'Edit Bank' : 'Add New Bank'}</h3>
              <button onClick={() => { setIsAddModalOpen(false); setEditingId(null); setNewBank({ name: '', code: '' }); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Input 
                label="Bank Full Name" 
                placeholder="e.g. State Bank of India"
                value={newBank.name}
                onChange={(e) => setNewBank({...newBank, name: e.target.value})}
              />
              <Input 
                label="Bank Code" 
                placeholder="e.g. SBI"
                value={newBank.code}
                onChange={(e) => setNewBank({...newBank, code: e.target.value.toUpperCase()})}
              />
              <div className="pt-2 flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button className="flex-1" isLoading={isSaving} onClick={saveBank}>Save Bank</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
