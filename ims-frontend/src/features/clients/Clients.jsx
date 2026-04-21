import React, { useState } from 'react';
import { ClientStore, GroupStore, ChainStore, BrandStore, SubzoneStore, ActivityStore } from '../../api/mockStore';
import DataTable, { StatusBadge } from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';
import { formatDate } from '../../utils/helpers';
import { Pencil, Trash2, Eye } from 'lucide-react';

const inputCls = (err) => `w-full px-4 py-2.5 bg-surface border rounded-xl text-textPrimary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${err ? 'border-danger' : 'border-border'}`;

const ClientForm = ({ initial = {}, onSave, onCancel }) => {
  const [form, setForm] = useState({
    clientName: initial.clientName || '', email: initial.email || '', phone: initial.phone || '',
    groupId: initial.groupId || '', chainId: initial.chainId || '', brandId: initial.brandId || '',
    subzoneId: initial.subzoneId || '', gstNumber: initial.gstNumber || '', address: initial.address || '',
    status: initial.status || 'active',
  });
  const [errors, setErrors] = useState({});
  const s = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.clientName.trim()) e.clientName = 'Name required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <form onSubmit={e => { e.preventDefault(); if (validate()) onSave({ ...form, groupId: Number(form.groupId) || null, chainId: Number(form.chainId) || null, brandId: Number(form.brandId) || null, subzoneId: Number(form.subzoneId) || null }); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-semibold text-textSecondary mb-1">Client Name *</label>
          <input value={form.clientName} onChange={e => s('clientName', e.target.value)} className={inputCls(errors.clientName)} />
          {errors.clientName && <p className="text-xs text-danger mt-1">{errors.clientName}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-textSecondary mb-1">Email *</label>
          <input type="email" value={form.email} onChange={e => s('email', e.target.value)} className={inputCls(errors.email)} />
          {errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-textSecondary mb-1">Phone</label>
          <input value={form.phone} onChange={e => s('phone', e.target.value)} className={inputCls(false)} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-textSecondary mb-1">Group</label>
          <select value={form.groupId} onChange={e => s('groupId', e.target.value)} className={inputCls(false)}>
            <option value="">— Select —</option>
            {GroupStore.list().map(g => <option key={g.groupId} value={g.groupId}>{g.groupName}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-textSecondary mb-1">Chain</label>
          <select value={form.chainId} onChange={e => s('chainId', e.target.value)} className={inputCls(false)}>
            <option value="">— Select —</option>
            {ChainStore.list().map(c => <option key={c.chainId} value={c.chainId}>{c.chainName}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-textSecondary mb-1">Brand</label>
          <select value={form.brandId} onChange={e => s('brandId', e.target.value)} className={inputCls(false)}>
            <option value="">— Select —</option>
            {BrandStore.list().map(b => <option key={b.brandId} value={b.brandId}>{b.brandName}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-textSecondary mb-1">Subzone</label>
          <select value={form.subzoneId} onChange={e => s('subzoneId', e.target.value)} className={inputCls(false)}>
            <option value="">— Select —</option>
            {SubzoneStore.list().map(z => <option key={z.subzoneId} value={z.subzoneId}>{z.subzoneName}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-textSecondary mb-1">GST Number</label>
          <input value={form.gstNumber} onChange={e => s('gstNumber', e.target.value)} className={inputCls(false)} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-textSecondary mb-1">Status</label>
          <select value={form.status} onChange={e => s('status', e.target.value)} className={inputCls(false)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-semibold text-textSecondary mb-1">Address</label>
          <textarea value={form.address} onChange={e => s('address', e.target.value)} rows={2}
            className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-textPrimary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="flex-1 py-2.5 bg-primary text-white font-semibold rounded-xl text-sm">Save Client</button>
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 border border-border text-textSecondary rounded-xl text-sm hover:bg-surface-hover">Cancel</button>
      </div>
    </form>
  );
};

const Clients = () => {
  const toast = useToast();
  const [clients, setClients] = useState(() => ClientStore.list());
  const [modal, setModal] = useState(null);
  const refresh = () => setClients(ClientStore.list());

  const handleSave = (form) => {
    if (modal.mode === 'add') { ClientStore.create(form); ActivityStore.add(`New client "${form.clientName}" added`, 'client'); toast({ type: 'success', message: 'Client created!' }); }
    else { ClientStore.update(modal.item.clientId, form); toast({ type: 'success', message: 'Client updated.' }); }
    refresh(); setModal(null);
  };

  const handleDelete = () => {
    ClientStore.delete(modal.item.clientId);
    toast({ type: 'info', message: `Client "${modal.item.clientName}" deleted.` });
    refresh(); setModal(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-textPrimary">Clients</h1>
      <DataTable
        columns={[{ key: 'clientName', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'phone', label: 'Phone' }, { key: 'gstNumber', label: 'GST No.' }, { key: 'status', label: 'Status' }, { key: 'act', label: '' }]}
        data={clients} searchFields={['clientName', 'email', 'phone', 'gstNumber']}
        onAdd={() => setModal({ mode: 'add' })} addLabel="New Client" emptyText="No clients yet."
        renderRow={(row) => (
          <tr key={row.clientId} className="border-b border-border/50 hover:bg-surface-hover/30 transition-colors">
            <td className="px-5 py-3.5"><p className="font-semibold text-textPrimary text-sm">{row.clientName}</p></td>
            <td className="px-5 py-3.5 text-textSecondary text-sm">{row.email}</td>
            <td className="px-5 py-3.5 text-textSecondary text-sm">{row.phone || '—'}</td>
            <td className="px-5 py-3.5 text-textSecondary text-sm font-mono text-xs">{row.gstNumber || '—'}</td>
            <td className="px-5 py-3.5"><StatusBadge status={row.status} /></td>
            <td className="px-5 py-3.5">
              <div className="flex gap-2 justify-end">
                <button onClick={() => setModal({ mode: 'view', item: row })} className="p-1.5 rounded-lg text-textSecondary hover:text-primary hover:bg-primary/10 transition-colors"><Eye className="h-4 w-4" /></button>
                <button onClick={() => setModal({ mode: 'edit', item: row })} className="p-1.5 rounded-lg text-textSecondary hover:text-primary hover:bg-primary/10 transition-colors"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => setModal({ mode: 'delete', item: row })} className="p-1.5 rounded-lg text-textSecondary hover:text-danger hover:bg-danger/10 transition-colors"><Trash2 className="h-4 w-4" /></button>
              </div>
            </td>
          </tr>
        )}
      />
      <Modal isOpen={modal?.mode === 'add' || modal?.mode === 'edit'} onClose={() => setModal(null)} title={modal?.mode === 'add' ? 'New Client' : 'Edit Client'} size="lg">
        <ClientForm initial={modal?.item || {}} onSave={handleSave} onCancel={() => setModal(null)} />
      </Modal>
      <Modal isOpen={modal?.mode === 'view'} onClose={() => setModal(null)} title="Client Details">
        {modal?.item && (
          <div className="space-y-3 text-sm">
            {[['Name', modal.item.clientName], ['Email', modal.item.email], ['Phone', modal.item.phone], ['GST No.', modal.item.gstNumber], ['Address', modal.item.address], ['Status', modal.item.status]].map(([l, v]) => (
              <div key={l} className="flex gap-4"><span className="font-semibold text-textSecondary w-24 shrink-0">{l}</span><span className="text-textPrimary">{v || '—'}</span></div>
            ))}
            <div className="flex gap-3 pt-4">
              <button onClick={() => setModal({ mode: 'edit', item: modal.item })} className="flex-1 py-2.5 bg-primary text-white font-semibold rounded-xl text-sm">Edit</button>
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-border text-textSecondary rounded-xl text-sm">Close</button>
            </div>
          </div>
        )}
      </Modal>
      <Modal isOpen={modal?.mode === 'delete'} onClose={() => setModal(null)} title="Delete Client" size="sm">
        <p className="text-sm text-textSecondary mb-6">Delete <strong>{modal?.item?.clientName}</strong>? This cannot be undone.</p>
        <div className="flex gap-3"><button onClick={handleDelete} className="flex-1 py-2.5 bg-danger text-white font-semibold rounded-xl text-sm">Delete</button><button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-border text-textSecondary rounded-xl text-sm">Cancel</button></div>
      </Modal>
    </div>
  );
};

export default Clients;
