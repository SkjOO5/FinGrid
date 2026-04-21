import React, { useState } from 'react';
import { ChainStore, GroupStore, ActivityStore } from '../../api/mockStore';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';
import { formatDate } from '../../utils/helpers';
import { Pencil, Trash2 } from 'lucide-react';

const ChainForm = ({ initial = {}, onSave, onCancel }) => {
  const groups = GroupStore.list();
  const [form, setForm] = useState({ chainName: initial.chainName || '', groupId: initial.groupId || '' });
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const validate = () => {
    const e = {};
    if (!form.chainName.trim()) e.chainName = 'Chain name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  return (
    <form onSubmit={e => { e.preventDefault(); if (validate()) onSave({ ...form, groupId: Number(form.groupId) || null }); }} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-textSecondary mb-1">Chain Name *</label>
        <input value={form.chainName} onChange={e => set('chainName', e.target.value)}
          className={`w-full px-4 py-2.5 bg-surface border rounded-xl text-textPrimary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${errors.chainName ? 'border-danger' : 'border-border'}`} />
        {errors.chainName && <p className="text-xs text-danger mt-1">{errors.chainName}</p>}
      </div>
      <div>
        <label className="block text-sm font-semibold text-textSecondary mb-1">Group</label>
        <select value={form.groupId} onChange={e => set('groupId', e.target.value)}
          className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-textPrimary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
          <option value="">— None —</option>
          {groups.map(g => <option key={g.groupId} value={g.groupId}>{g.groupName}</option>)}
        </select>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="flex-1 py-2.5 bg-primary text-white font-semibold rounded-xl text-sm">Save</button>
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 border border-border text-textSecondary rounded-xl text-sm hover:bg-surface-hover">Cancel</button>
      </div>
    </form>
  );
};

const Chains = () => {
  const toast = useToast();
  const [chains, setChains] = useState(() => ChainStore.list());
  const [modal, setModal] = useState(null);
  const groups = GroupStore.list();
  const refresh = () => setChains(ChainStore.list());
  const getGroupName = (id) => groups.find(g => g.groupId === Number(id))?.groupName || '—';

  const handleSave = (form) => {
    if (modal.mode === 'add') { ChainStore.create(form); toast({ type: 'success', message: 'Chain created!' }); }
    else { ChainStore.update(modal.item.chainId, form); toast({ type: 'success', message: 'Chain updated.' }); }
    refresh(); setModal(null);
  };

  const handleDelete = () => {
    ChainStore.delete(modal.item.chainId);
    toast({ type: 'info', message: `"${modal.item.chainName}" deleted.` });
    refresh(); setModal(null);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-textPrimary">Chains</h1>
      <DataTable
        columns={[{ key: 'chainName', label: 'Chain Name' }, { key: 'group', label: 'Group' }, { key: 'createdAt', label: 'Created' }, { key: 'actions', label: '' }]}
        data={chains}
        searchFields={['chainName']}
        onAdd={() => setModal({ mode: 'add' })}
        addLabel="New Chain"
        emptyText="No chains yet."
        renderRow={(row) => (
          <tr key={row.chainId} className="border-b border-border/50 hover:bg-surface-hover/30 transition-colors">
            <td className="px-5 py-3.5 font-semibold text-textPrimary text-sm">{row.chainName}</td>
            <td className="px-5 py-3.5 text-textSecondary text-sm">{getGroupName(row.groupId)}</td>
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
      <Modal isOpen={modal?.mode === 'add' || modal?.mode === 'edit'} onClose={() => setModal(null)} title={modal?.mode === 'add' ? 'New Chain' : 'Edit Chain'}>
        <ChainForm initial={modal?.item || {}} onSave={handleSave} onCancel={() => setModal(null)} />
      </Modal>
      <Modal isOpen={modal?.mode === 'delete'} onClose={() => setModal(null)} title="Delete Chain" size="sm">
        <p className="text-textSecondary text-sm mb-6">Delete <strong>{modal?.item?.chainName}</strong>?</p>
        <div className="flex gap-3">
          <button onClick={handleDelete} className="flex-1 py-2.5 bg-danger text-white font-semibold rounded-xl text-sm">Delete</button>
          <button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-border text-textSecondary rounded-xl text-sm hover:bg-surface-hover">Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default Chains;
