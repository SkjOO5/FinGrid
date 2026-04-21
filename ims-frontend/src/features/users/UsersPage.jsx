import React, { useState } from 'react';
import { UserStore, ActivityStore } from '../../api/mockStore';
import DataTable, { StatusBadge } from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';
import { formatDate } from '../../utils/helpers';
import { Pencil, Trash2, UserPlus } from 'lucide-react';
import { mockRegister } from '../../api/mockAuth';

const inputCls = 'w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-textPrimary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40';

const UserForm = ({ initial = {}, onSave, onCancel, isEdit = false }) => {
  const [form, setForm] = useState({ fullName: initial.fullName || '', email: initial.email || '', role: initial.role || 'SALESPERSON', status: initial.status || 'active', password: '' });
  const [errors, setErrors] = useState({});
  const s = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Name required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (!isEdit && !form.password) e.password = 'Password required for new user';
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  return (
    <form onSubmit={e => { e.preventDefault(); if (validate()) onSave(form); }} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-textSecondary mb-1">Full Name</label>
        <input value={form.fullName} onChange={e => s('fullName', e.target.value)} className={`${inputCls} ${errors.fullName ? 'border-danger' : ''}`} />
        {errors.fullName && <p className="text-xs text-danger mt-1">{errors.fullName}</p>}
      </div>
      <div>
        <label className="block text-xs font-semibold text-textSecondary mb-1">Email</label>
        <input type="email" value={form.email} onChange={e => s('email', e.target.value)} className={`${inputCls} ${errors.email ? 'border-danger' : ''}`} readOnly={isEdit} />
        {errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
      </div>
      {!isEdit && (
        <div>
          <label className="block text-xs font-semibold text-textSecondary mb-1">Password</label>
          <input type="password" value={form.password} onChange={e => s('password', e.target.value)} className={`${inputCls} ${errors.password ? 'border-danger' : ''}`} placeholder="Min 6 characters" />
          {errors.password && <p className="text-xs text-danger mt-1">{errors.password}</p>}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-textSecondary mb-1">Role</label>
          <select value={form.role} onChange={e => s('role', e.target.value)} className={inputCls}>
            <option value="ADMIN">Admin</option>
            <option value="SALESPERSON">Salesperson</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-textSecondary mb-1">Status</label>
          <select value={form.status} onChange={e => s('status', e.target.value)} className={inputCls}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="flex-1 py-2.5 bg-primary text-white font-semibold rounded-xl text-sm">Save</button>
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 border border-border text-textSecondary rounded-xl text-sm hover:bg-surface-hover">Cancel</button>
      </div>
    </form>
  );
};

const UsersPage = () => {
  const toast = useToast();
  const [users, setUsers] = useState(() => {
    const stored = JSON.parse(localStorage.getItem('ims_mock_users') || '[]');
    return stored.map(({ password: _, ...u }) => u);
  });
  const [modal, setModal] = useState(null);
  const refresh = () => {
    const stored = JSON.parse(localStorage.getItem('ims_mock_users') || '[]');
    setUsers(stored.map(({ password: _, ...u }) => u));
  };

  const handleSave = (form) => {
    if (modal.mode === 'add') {
      const result = mockRegister(form.fullName, form.email, form.password, form.role);
      if (!result.success) { toast({ type: 'error', message: result.message }); return; }
      ActivityStore.add(`New user ${form.fullName} added`, 'info');
      toast({ type: 'success', message: 'User created!' });
    } else {
      const stored = JSON.parse(localStorage.getItem('ims_mock_users') || '[]');
      const updated = stored.map(u => u.email === modal.item.email ? { ...u, fullName: form.fullName, role: form.role, status: form.status } : u);
      localStorage.setItem('ims_mock_users', JSON.stringify(updated));
      toast({ type: 'success', message: 'User updated.' });
    }
    refresh(); setModal(null);
  };

  const handleDelete = () => {
    const stored = JSON.parse(localStorage.getItem('ims_mock_users') || '[]');
    const updated = stored.filter(u => u.email !== modal.item.email);
    localStorage.setItem('ims_mock_users', JSON.stringify(updated));
    toast({ type: 'info', message: 'User removed.' });
    refresh(); setModal(null);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-textPrimary">User Management</h1>
      <DataTable
        data={users} searchFields={['fullName', 'email']}
        onAdd={() => setModal({ mode: 'add' })} addLabel="New User" emptyText="No users found. Register to add the first user."
        columns={[{ key: 'fullName', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'role', label: 'Role' }, { key: 'status', label: 'Status' }, { key: 'createdAt', label: 'Joined' }, { key: 'act', label: '' }]}
        renderRow={(row) => (
          <tr key={row.email} className="border-b border-border/50 hover:bg-surface-hover/30 transition-colors">
            <td className="px-5 py-3.5 font-semibold text-textPrimary text-sm">{row.fullName}</td>
            <td className="px-5 py-3.5 text-textSecondary text-sm">{row.email}</td>
            <td className="px-5 py-3.5 text-sm"><span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${row.role === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>{row.role}</span></td>
            <td className="px-5 py-3.5"><StatusBadge status={row.status} /></td>
            <td className="px-5 py-3.5 text-textSecondary text-sm">{formatDate(row.createdAt)}</td>
            <td className="px-5 py-3.5"><div className="flex gap-2 justify-end">
              <button onClick={() => setModal({ mode: 'edit', item: row })} className="p-1.5 rounded-lg text-textSecondary hover:text-primary hover:bg-primary/10 transition-colors"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => setModal({ mode: 'delete', item: row })} className="p-1.5 rounded-lg text-textSecondary hover:text-danger hover:bg-danger/10 transition-colors"><Trash2 className="h-4 w-4" /></button>
            </div></td>
          </tr>
        )}
      />
      <Modal isOpen={modal?.mode === 'add' || modal?.mode === 'edit'} onClose={() => setModal(null)} title={modal?.mode === 'add' ? 'Add New User' : 'Edit User'}>
        <UserForm initial={modal?.item || {}} onSave={handleSave} onCancel={() => setModal(null)} isEdit={modal?.mode === 'edit'} />
      </Modal>
      <Modal isOpen={modal?.mode === 'delete'} onClose={() => setModal(null)} title="Remove User" size="sm">
        <p className="text-sm text-textSecondary mb-6">Remove <strong>{modal?.item?.fullName}</strong> from FinGrid?</p>
        <div className="flex gap-3"><button onClick={handleDelete} className="flex-1 py-2.5 bg-danger text-white font-semibold rounded-xl text-sm">Remove</button><button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-border text-textSecondary rounded-xl text-sm">Cancel</button></div>
      </Modal>
    </div>
  );
};

export default UsersPage;
