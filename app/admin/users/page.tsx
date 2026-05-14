'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  Users, 
  Search, 
  UserPlus, 
  Mail, 
  Shield, 
  MapPin,
  CheckCircle2,
  Clock,
  X,
  Trash2,
  Edit2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({ full_name: '', email: '', role: 'engineer' });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('full_name', { ascending: true });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveUser() {
    if (!newUser.full_name || !newUser.email) return alert('Please fill all fields');
    setIsSaving(true);
    try {
      if (editingId) {
        const { data, error } = await supabase
          .from('users')
          .update(newUser)
          .eq('id', editingId)
          .select()
          .single();
        
        if (error) throw error;
        setUsers(users.map(u => u.id === editingId ? data : u));
      } else {
        const { data, error } = await supabase
          .from('users')
          .insert([newUser])
          .select()
          .single();
        
        if (error) throw error;
        setUsers([...users, data]);
      }
      setIsInviteModalOpen(false);
      setEditingId(null);
      setNewUser({ full_name: '', email: '', role: 'engineer' });
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to save user. Email might be duplicate.');
    } finally {
      setIsSaving(false);
    }
  }

  function startEdit(user: any) {
    setEditingId(user.id);
    setNewUser({ full_name: user.full_name, email: user.email, role: user.role });
    setIsInviteModalOpen(true);
  }

  async function deleteUser(id: string) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (error) throw error;
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user.');
    }
  }

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Control access for admins and field engineers.</p>
        </div>
        <Button icon={UserPlus} onClick={() => setIsInviteModalOpen(true)}>Invite User</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Staff</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Engineers</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {users.filter(u => u.role === 'engineer').length}
            </p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
            <Clock className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending Invites</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">2</p>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email or role..."
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
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">Loading users...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                          {user.full_name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{user.full_name}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{user.id.substring(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        user.role === 'super_admin' 
                          ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20' 
                          : user.role === 'admin'
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                          : 'bg-green-50 text-green-600 dark:bg-green-900/20'
                      }`}>
                        <Shield className="h-3 w-3" />
                        {user.role?.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        {user.role === 'engineer' && (
                          <div className="flex items-center gap-2 text-[10px] text-gray-400">
                            <MapPin className="h-3 w-3" />
                            Active in Ahmedabad
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => startEdit(user)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => deleteUser(user.id)}
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

      {/* Invite User Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{editingId ? 'Edit User' : 'Invite New User'}</h3>
              <button onClick={() => { setIsInviteModalOpen(false); setEditingId(null); setNewUser({ full_name: '', email: '', role: 'engineer' }); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Input 
                label="Full Name" 
                placeholder="e.g. Amit Sharma"
                value={newUser.full_name}
                onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
              />
              <Input 
                label="Email Address" 
                placeholder="amit@astron.com"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              />
              <Select 
                label="Role"
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                options={[
                  { label: 'Admin', value: 'admin' },
                  { label: 'Field Engineer', value: 'engineer' },
                  { label: 'Super Admin', value: 'super_admin' },
                ]}
              />
              <div className="pt-2 flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setIsInviteModalOpen(false)}>Cancel</Button>
                <Button className="flex-1" isLoading={isSaving} onClick={saveUser}>Send Invite</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
