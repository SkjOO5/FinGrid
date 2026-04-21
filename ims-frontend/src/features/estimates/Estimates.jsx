import React, { useState } from 'react';
import { EstimateStore, ClientStore, ChainStore, ActivityStore, nextEstimateNo, calcGST, InvoiceStore, nextInvoiceNo } from '../../api/mockStore';
import DataTable, { StatusBadge } from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { Pencil, Trash2, Eye, Plus, Minus, Send, CheckCircle } from 'lucide-react';
import { useSelector } from 'react-redux';

const inputCls = 'w-full px-3 py-2 bg-surface border border-border rounded-xl text-textPrimary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40';

const EstimateForm = ({ initial = {}, onSave, onCancel }) => {
  const user = useSelector(s => s.auth.user);
  const clients = ClientStore.list();
  const chains = ChainStore.list();
  const [form, setForm] = useState({
    clientId: initial.clientId || '',
    chainId: initial.chainId || '',
    validUntil: initial.validUntil || '',
    notes: initial.notes || '',
    items: initial.items?.length ? initial.items : [{ description: '', qty: 1, rate: 0, amount: 0 }],
  });
  const [errors, setErrors] = useState({});
  const s = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const updateItem = (i, k, v) => {
    const items = [...form.items];
    items[i] = { ...items[i], [k]: v };
    if (k === 'qty' || k === 'rate') items[i].amount = (Number(items[i].qty) * Number(items[i].rate));
    setForm(f => ({ ...f, items }));
  };
  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { description: '', qty: 1, rate: 0, amount: 0 }] }));
  const removeItem = (i) => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));

  const subtotal = form.items.reduce((sum, it) => sum + Number(it.amount || 0), 0);
  const { gstAmount, grandTotal } = calcGST(subtotal);

  const validate = () => {
    const e = {};
    if (!form.clientId) e.clientId = 'Client required';
    if (form.items.some(it => !it.description.trim())) e.items = 'All line items need a description';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <form onSubmit={e => { e.preventDefault(); if (!validate()) return; onSave({ ...form, clientId: Number(form.clientId), chainId: Number(form.chainId) || null, totalAmount: subtotal, gstAmount, grandTotal, createdBy: user?.userId || 1 }); }} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-textSecondary mb-1">Client *</label>
          <select value={form.clientId} onChange={e => s('clientId', e.target.value)} className={`${inputCls} ${errors.clientId ? 'border-danger' : ''}`}>
            <option value="">— Select Client —</option>
            {clients.map(c => <option key={c.clientId} value={c.clientId}>{c.clientName}</option>)}
          </select>
          {errors.clientId && <p className="text-xs text-danger mt-1">{errors.clientId}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-textSecondary mb-1">Chain</label>
          <select value={form.chainId} onChange={e => s('chainId', e.target.value)} className={inputCls}>
            <option value="">— Select Chain —</option>
            {chains.map(c => <option key={c.chainId} value={c.chainId}>{c.chainName}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-textSecondary mb-1">Valid Until</label>
          <input type="date" value={form.validUntil} onChange={e => s('validUntil', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-textSecondary mb-1">Notes</label>
          <input value={form.notes} onChange={e => s('notes', e.target.value)} className={inputCls} />
        </div>
      </div>

      {/* Line Items */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-textSecondary">Line Items</label>
          <button type="button" onClick={addItem} className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline"><Plus className="h-3 w-3" />Add Item</button>
        </div>
        {errors.items && <p className="text-xs text-danger mb-2">{errors.items}</p>}
        <div className="space-y-2">
          {form.items.map((item, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <input value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} placeholder="Description" className={`${inputCls} col-span-5`} />
              <input type="number" value={item.qty} onChange={e => updateItem(i, 'qty', e.target.value)} className={`${inputCls} col-span-2`} min={1} />
              <input type="number" value={item.rate} onChange={e => updateItem(i, 'rate', e.target.value)} className={`${inputCls} col-span-2`} min={0} />
              <div className="col-span-2 text-sm font-semibold text-textPrimary text-right">{formatCurrency(item.amount)}</div>
              {form.items.length > 1 && <button type="button" onClick={() => removeItem(i)} className="col-span-1 text-danger hover:text-danger/70"><Minus className="h-4 w-4" /></button>}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-12 gap-2 text-xs text-textSecondary mt-1 px-1">
          <span className="col-span-5">Description</span><span className="col-span-2">Qty</span><span className="col-span-2">Rate (₹)</span><span className="col-span-2 text-right">Amount</span>
        </div>
      </div>

      {/* Totals */}
      <div className="bg-surface-hover rounded-xl p-4 text-sm space-y-1">
        <div className="flex justify-between"><span className="text-textSecondary">Subtotal</span><span className="font-semibold">{formatCurrency(subtotal)}</span></div>
        <div className="flex justify-between"><span className="text-textSecondary">GST (18%)</span><span className="font-semibold">{formatCurrency(gstAmount)}</span></div>
        <div className="flex justify-between border-t border-border pt-2 mt-2 font-bold text-base"><span>Grand Total</span><span className="text-primary">{formatCurrency(grandTotal)}</span></div>
      </div>

      <div className="flex gap-3">
        <button type="submit" className="flex-1 py-2.5 bg-primary text-white font-semibold rounded-xl text-sm">Save Estimate</button>
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 border border-border text-textSecondary rounded-xl text-sm hover:bg-surface-hover">Cancel</button>
      </div>
    </form>
  );
};

const Estimates = () => {
  const toast = useToast();
  const [estimates, setEstimates] = useState(() => EstimateStore.list());
  const [modal, setModal] = useState(null);
  const clients = ClientStore.list();
  const refresh = () => setEstimates(EstimateStore.list());
  const getClientName = id => clients.find(c => c.clientId === Number(id))?.clientName || '—';

  const handleSave = (form) => {
    if (modal.mode === 'add') {
      const est = EstimateStore.create({ ...form, estimateNo: nextEstimateNo(), status: 'draft' });
      ActivityStore.add(`Estimate ${est.estimateNo} created`, 'estimate');
      toast({ type: 'success', message: `Estimate ${est.estimateNo} created!` });
    } else {
      EstimateStore.update(modal.item.estimateId, form);
      toast({ type: 'success', message: 'Estimate updated.' });
    }
    refresh(); setModal(null);
  };

  const handleStatusChange = (est, newStatus) => {
    EstimateStore.update(est.estimateId, { status: newStatus });
    if (newStatus === 'approved') {
      // Auto-generate invoice
      const { gstAmount, grandTotal } = calcGST(est.totalAmount);
      const inv = InvoiceStore.create({ invoiceNo: nextInvoiceNo(), estimateId: est.estimateId, clientId: est.clientId, chainId: est.chainId, createdBy: est.createdBy, totalAmount: est.totalAmount, gstAmount, grandTotal, status: 'unpaid', issuedDate: new Date().toISOString().split('T')[0], dueDate: '' });
      ActivityStore.add(`Invoice ${inv.invoiceNo} auto-generated from estimate ${est.estimateNo}`, 'invoice');
      toast({ type: 'success', message: `Approved! Invoice ${inv.invoiceNo} auto-generated.` });
    } else {
      toast({ type: 'info', message: `Status updated to "${newStatus}".` });
    }
    refresh();
  };

  const handleDelete = () => {
    EstimateStore.delete(modal.item.estimateId);
    toast({ type: 'info', message: 'Estimate deleted.' });
    refresh(); setModal(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-textPrimary">Estimates</h1>
      <DataTable
        data={estimates} searchFields={['estimateNo', 'notes']}
        onAdd={() => setModal({ mode: 'add' })} addLabel="New Estimate" emptyText="No estimates yet."
        columns={[{ key: 'estimateNo', label: 'Estimate No.' }, { key: 'client', label: 'Client' }, { key: 'grandTotal', label: 'Grand Total' }, { key: 'status', label: 'Status' }, { key: 'validUntil', label: 'Valid Until' }, { key: 'act', label: '' }]}
        renderRow={(row) => (
          <tr key={row.estimateId} className="border-b border-border/50 hover:bg-surface-hover/30 transition-colors">
            <td className="px-5 py-3.5 font-mono text-sm font-semibold text-primary">{row.estimateNo}</td>
            <td className="px-5 py-3.5 text-textPrimary text-sm">{getClientName(row.clientId)}</td>
            <td className="px-5 py-3.5 font-semibold text-textPrimary text-sm">{formatCurrency(row.grandTotal)}</td>
            <td className="px-5 py-3.5"><StatusBadge status={row.status} /></td>
            <td className="px-5 py-3.5 text-textSecondary text-sm">{formatDate(row.validUntil)}</td>
            <td className="px-5 py-3.5">
              <div className="flex gap-2 justify-end">
                {row.status === 'draft' && <button onClick={() => handleStatusChange(row, 'sent')} title="Mark as Sent" className="p-1.5 rounded-lg text-textSecondary hover:text-primary hover:bg-primary/10 transition-colors"><Send className="h-4 w-4" /></button>}
                {row.status === 'sent' && <button onClick={() => handleStatusChange(row, 'approved')} title="Approve (auto-generates invoice)" className="p-1.5 rounded-lg text-textSecondary hover:text-success hover:bg-success/10 transition-colors"><CheckCircle className="h-4 w-4" /></button>}
                <button onClick={() => setModal({ mode: 'edit', item: row })} className="p-1.5 rounded-lg text-textSecondary hover:text-primary hover:bg-primary/10 transition-colors"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => setModal({ mode: 'delete', item: row })} className="p-1.5 rounded-lg text-textSecondary hover:text-danger hover:bg-danger/10 transition-colors"><Trash2 className="h-4 w-4" /></button>
              </div>
            </td>
          </tr>
        )}
      />
      <Modal isOpen={modal?.mode === 'add' || modal?.mode === 'edit'} onClose={() => setModal(null)} title={modal?.mode === 'add' ? 'New Estimate' : 'Edit Estimate'} size="xl">
        <EstimateForm initial={modal?.item || {}} onSave={handleSave} onCancel={() => setModal(null)} />
      </Modal>
      <Modal isOpen={modal?.mode === 'delete'} onClose={() => setModal(null)} title="Delete Estimate" size="sm">
        <p className="text-sm text-textSecondary mb-6">Delete estimate <strong>{modal?.item?.estimateNo}</strong>?</p>
        <div className="flex gap-3"><button onClick={handleDelete} className="flex-1 py-2.5 bg-danger text-white font-semibold rounded-xl text-sm">Delete</button><button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-border text-textSecondary rounded-xl text-sm">Cancel</button></div>
      </Modal>
    </div>
  );
};

export default Estimates;
