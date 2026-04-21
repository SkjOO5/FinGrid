import React, { useState } from 'react';
import { GroupStore, ActivityStore } from '../../api/mockStore';
import DataTable, { StatusBadge } from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';
import { formatDate } from '../../utils/helpers';
import { Pencil, Trash2 } from 'lucide-react';

const GroupForm = ({ initial = {}, onSave, onCancel }) => {
  const [form, setForm] = useState({ groupName: initial.groupName || '', description: initial.description || '' });
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const validate = () => {
    const e = {};
    if (!form.groupName.trim()) e.groupName = 'Group name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  return (
    <form onSubmit={e => { e.preventDefault(); if (validate()) onSave(form); }} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-textSecondary mb-1">Group Name *</label>
        <input value={form.groupName} onChange={e => set('groupName', e.target.value)}
          className={`w-full px-4 py-2.5 bg-surface border rounded-xl text-textPrimary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${errors.groupName ? 'border-danger' : 'border-border'}`} />
        {errors.groupName && <p className="text-xs text-danger mt-1">{errors.groupName}</p>}
      </div>
      <div>
        <label className="block text-sm font-semibold text-textSecondary mb-1">Description</label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3}
          className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-textPrimary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="flex-1 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all text-sm">Save</button>
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 border border-border text-textSecondary rounded-xl hover:bg-surface-hover transition-all text-sm">Cancel</button>
      </div>
    </form>
  );
};

const Groups = () => {
  const toast = useToast();
  const [groups, setGroups] = useState(() => GroupStore.list());
  const [modal, setModal] = useState(null); // { mode: 'add'|'edit'|'delete', item?: {} }
  const refresh = () => setGroups(GroupStore.list());

  const handleSave = (form) => {
    if (modal.mode === 'add') {
      GroupStore.create(form);
      ActivityStore.add(`New group "${form.groupName}" created`, 'info');
      toast({ type: 'success', message: 'Group created successfully!' });
    } else {
      GroupStore.update(modal.item.groupId, form);
      toast({ type: 'success', message: 'Group updated.' });
    }
    refresh();
    setModal(null);
  };

  const handleDelete = () => {
    GroupStore.delete(modal.item.groupId);
    toast({ type: 'info', message: `"${modal.item.groupName}" deleted.` });
    refresh();
    setModal(null);
  };

  const columns = [
    { key: 'groupName', label: 'Group Name' },
    { key: 'description', label: 'Description' },
    { key: 'createdAt', label: 'Created' },
    { key: 'actions', label: '' },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-textPrimary">Groups</h1>
      <DataTable
        columns={columns}
        data={groups}
        searchFields={['groupName', 'description']}
        onAdd={() => setModal({ mode: 'add' })}
        addLabel="New Group"
        emptyText="No groups yet."
        renderRow={(row) => (
          <tr key={row.groupId} className="border-b border-border/50 hover:bg-surface-hover/30 transition-colors">
            <td className="px-5 py-3.5 font-semibold text-textPrimary text-sm">{row.groupName}</td>
            <td className="px-5 py-3.5 text-textSecondary text-sm">{row.description || '—'}</td>
            <td className="px-5 py-3.5 text-textSecondary text-sm">{formatDate(row.createdAt)}</td>
            <td className="px-5 py-3.5">
              <div className="flex items-center gap-2 justify-end">
                <button onClick={() => setModal({ mode: 'edit', item: row })} className="p-1.5 rounded-lg text-textSecondary hover:text-primary hover:bg-primary/10 transition-colors"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => setModal({ mode: 'delete', item: row })} className="p-1.5 rounded-lg text-textSecondary hover:text-danger hover:bg-danger/10 transition-colors"><Trash2 className="h-4 w-4" /></button>
              </div>
            </td>
          </tr>
        )}
      />

      {/* Add/Edit Modal */}
      <Modal isOpen={modal?.mode === 'add' || modal?.mode === 'edit'} onClose={() => setModal(null)} title={modal?.mode === 'add' ? 'New Group' : 'Edit Group'}>
        <GroupForm initial={modal?.item || {}} onSave={handleSave} onCancel={() => setModal(null)} />
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={modal?.mode === 'delete'} onClose={() => setModal(null)} title="Delete Group" size="sm">
        <p className="text-textSecondary text-sm mb-6">Are you sure you want to delete <strong>{modal?.item?.groupName}</strong>? This cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={handleDelete} className="flex-1 py-2.5 bg-danger text-white font-semibold rounded-xl text-sm">Delete</button>
          <button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-border text-textSecondary rounded-xl text-sm hover:bg-surface-hover">Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default Groups;
