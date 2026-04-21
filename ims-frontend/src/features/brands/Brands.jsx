import React, { useState } from 'react';
import { BrandStore, ChainStore } from '../../api/mockStore';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';
import { formatDate } from '../../utils/helpers';
import { Pencil, Trash2 } from 'lucide-react';

const BrandForm = ({ initial = {}, onSave, onCancel }) => {
  const chains = ChainStore.list();
  const [form, setForm] = useState({ brandName: initial.brandName || '', chainId: initial.chainId || '' });
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <form onSubmit={e => { e.preventDefault(); if (!form.brandName.trim()) { setErrors({ brandName: 'Required' }); return; } onSave({ ...form, chainId: Number(form.chainId) || null }); }} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-textSecondary mb-1">Brand Name *</label>
        <input value={form.brandName} onChange={e => set('brandName', e.target.value)}
          className={`w-full px-4 py-2.5 bg-surface border rounded-xl text-textPrimary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${errors.brandName ? 'border-danger' : 'border-border'}`} />
        {errors.brandName && <p className="text-xs text-danger mt-1">{errors.brandName}</p>}
      </div>
      <div>
        <label className="block text-sm font-semibold text-textSecondary mb-1">Chain</label>
        <select value={form.chainId} onChange={e => set('chainId', e.target.value)}
          className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-textPrimary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
          <option value="">— None —</option>
          {chains.map(c => <option key={c.chainId} value={c.chainId}>{c.chainName}</option>)}
        </select>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="flex-1 py-2.5 bg-primary text-white font-semibold rounded-xl text-sm">Save</button>
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 border border-border text-textSecondary rounded-xl text-sm hover:bg-surface-hover">Cancel</button>
      </div>
    </form>
  );
};

const Brands = () => {
  const toast = useToast();
  const [brands, setBrands] = useState(() => BrandStore.list());
  const [modal, setModal] = useState(null);
  const chains = ChainStore.list();
  const refresh = () => setBrands(BrandStore.list());
  const getChainName = (id) => chains.find(c => c.chainId === Number(id))?.chainName || '—';
  const handleSave = (form) => { modal.mode === 'add' ? BrandStore.create(form) : BrandStore.update(modal.item.brandId, form); toast({ type: 'success', message: `Brand ${modal.mode === 'add' ? 'created' : 'updated'}!` }); refresh(); setModal(null); };
  const handleDelete = () => { BrandStore.delete(modal.item.brandId); toast({ type: 'info', message: 'Brand deleted.' }); refresh(); setModal(null); };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-textPrimary">Brands</h1>
      <DataTable
        columns={[{ key: 'brandName', label: 'Brand' }, { key: 'chain', label: 'Chain' }, { key: 'createdAt', label: 'Created' }, { key: 'act', label: '' }]}
        data={brands} searchFields={['brandName']} onAdd={() => setModal({ mode: 'add' })} addLabel="New Brand" emptyText="No brands yet."
        renderRow={(row) => (
          <tr key={row.brandId} className="border-b border-border/50 hover:bg-surface-hover/30 transition-colors">
            <td className="px-5 py-3.5 font-semibold text-textPrimary text-sm">{row.brandName}</td>
            <td className="px-5 py-3.5 text-textSecondary text-sm">{getChainName(row.chainId)}</td>
            <td className="px-5 py-3.5 text-textSecondary text-sm">{formatDate(row.createdAt)}</td>
            <td className="px-5 py-3.5"><div className="flex gap-2 justify-end">
              <button onClick={() => setModal({ mode: 'edit', item: row })} className="p-1.5 rounded-lg text-textSecondary hover:text-primary hover:bg-primary/10 transition-colors"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => setModal({ mode: 'delete', item: row })} className="p-1.5 rounded-lg text-textSecondary hover:text-danger hover:bg-danger/10 transition-colors"><Trash2 className="h-4 w-4" /></button>
            </div></td>
          </tr>
        )}
      />
      <Modal isOpen={modal?.mode === 'add' || modal?.mode === 'edit'} onClose={() => setModal(null)} title={modal?.mode === 'add' ? 'New Brand' : 'Edit Brand'}>
        <BrandForm initial={modal?.item || {}} onSave={handleSave} onCancel={() => setModal(null)} />
      </Modal>
      <Modal isOpen={modal?.mode === 'delete'} onClose={() => setModal(null)} title="Delete Brand" size="sm">
        <p className="text-sm text-textSecondary mb-6">Delete <strong>{modal?.item?.brandName}</strong>?</p>
        <div className="flex gap-3"><button onClick={handleDelete} className="flex-1 py-2.5 bg-danger text-white font-semibold rounded-xl text-sm">Delete</button><button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-border text-textSecondary rounded-xl text-sm">Cancel</button></div>
      </Modal>
    </div>
  );
};

export default Brands;
