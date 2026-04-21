import React, { useState } from 'react';
import { SubzoneStore } from '../../api/mockStore';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';
import { formatDate } from '../../utils/helpers';
import { Pencil, Trash2 } from 'lucide-react';

const SubzoneForm = ({ initial = {}, onSave, onCancel }) => {
  const [form, setForm] = useState({ subzoneName: initial.subzoneName || '', region: initial.region || '' });
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <form onSubmit={e => { e.preventDefault(); if (!form.subzoneName.trim()) { setErrors({ subzoneName: 'Required' }); return; } onSave(form); }} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-textSecondary mb-1">Subzone Name *</label>
        <input value={form.subzoneName} onChange={e => set('subzoneName', e.target.value)}
          className={`w-full px-4 py-2.5 bg-surface border rounded-xl text-textPrimary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${errors.subzoneName ? 'border-danger' : 'border-border'}`} />
        {errors.subzoneName && <p className="text-xs text-danger mt-1">{errors.subzoneName}</p>}
      </div>
      <div>
        <label className="block text-sm font-semibold text-textSecondary mb-1">Region</label>
        <input value={form.region} onChange={e => set('region', e.target.value)} placeholder="e.g. Delhi NCR"
          className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-textPrimary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="flex-1 py-2.5 bg-primary text-white font-semibold rounded-xl text-sm">Save</button>
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 border border-border text-textSecondary rounded-xl text-sm">Cancel</button>
      </div>
    </form>
  );
};

const Subzones = () => {
  const toast = useToast();
  const [subzones, setSubzones] = useState(() => SubzoneStore.list());
  const [modal, setModal] = useState(null);
  const refresh = () => setSubzones(SubzoneStore.list());
  const handleSave = (form) => { modal.mode === 'add' ? SubzoneStore.create(form) : SubzoneStore.update(modal.item.subzoneId, form); toast({ type: 'success', message: `Subzone ${modal.mode === 'add' ? 'created' : 'updated'}!` }); refresh(); setModal(null); };
  const handleDelete = () => { SubzoneStore.delete(modal.item.subzoneId); toast({ type: 'info', message: 'Subzone deleted.' }); refresh(); setModal(null); };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-textPrimary">Subzones</h1>
      <DataTable
        columns={[{ key: 'subzoneName', label: 'Subzone' }, { key: 'region', label: 'Region' }, { key: 'createdAt', label: 'Created' }, { key: 'act', label: '' }]}
        data={subzones} searchFields={['subzoneName', 'region']} onAdd={() => setModal({ mode: 'add' })} addLabel="New Subzone" emptyText="No subzones yet."
        renderRow={(row) => (
          <tr key={row.subzoneId} className="border-b border-border/50 hover:bg-surface-hover/30 transition-colors">
            <td className="px-5 py-3.5 font-semibold text-textPrimary text-sm">{row.subzoneName}</td>
            <td className="px-5 py-3.5 text-textSecondary text-sm">{row.region || '—'}</td>
            <td className="px-5 py-3.5 text-textSecondary text-sm">{formatDate(row.createdAt)}</td>
            <td className="px-5 py-3.5"><div className="flex gap-2 justify-end">
              <button onClick={() => setModal({ mode: 'edit', item: row })} className="p-1.5 rounded-lg text-textSecondary hover:text-primary hover:bg-primary/10 transition-colors"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => setModal({ mode: 'delete', item: row })} className="p-1.5 rounded-lg text-textSecondary hover:text-danger hover:bg-danger/10 transition-colors"><Trash2 className="h-4 w-4" /></button>
            </div></td>
          </tr>
        )}
      />
      <Modal isOpen={modal?.mode === 'add' || modal?.mode === 'edit'} onClose={() => setModal(null)} title={modal?.mode === 'add' ? 'New Subzone' : 'Edit Subzone'}>
        <SubzoneForm initial={modal?.item || {}} onSave={handleSave} onCancel={() => setModal(null)} />
      </Modal>
      <Modal isOpen={modal?.mode === 'delete'} onClose={() => setModal(null)} title="Delete Subzone" size="sm">
        <p className="text-sm text-textSecondary mb-6">Delete <strong>{modal?.item?.subzoneName}</strong>?</p>
        <div className="flex gap-3"><button onClick={handleDelete} className="flex-1 py-2.5 bg-danger text-white font-semibold rounded-xl text-sm">Delete</button><button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-border text-textSecondary rounded-xl text-sm">Cancel</button></div>
      </Modal>
    </div>
  );
};

export default Subzones;
