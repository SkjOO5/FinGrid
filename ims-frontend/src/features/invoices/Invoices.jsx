import React, { useState } from 'react';
import { InvoiceStore, ClientStore, ChainStore, PaymentStore, nextInvoiceNo, calcGST, ActivityStore } from '../../api/mockStore';
import DataTable, { StatusBadge } from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { Pencil, Trash2, Eye, CreditCard } from 'lucide-react';
import { useSelector } from 'react-redux';

const inputCls = 'w-full px-3 py-2 bg-surface border border-border rounded-xl text-textPrimary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40';

const InvoiceForm = ({ initial = {}, onSave, onCancel }) => {
  const user = useSelector(s => s.auth.user);
  const clients = ClientStore.list();
  const chains = ChainStore.list();
  const [form, setForm] = useState({
    clientId: initial.clientId || '', chainId: initial.chainId || '', totalAmount: initial.totalAmount || '',
    dueDate: initial.dueDate || '', notes: initial.notes || '',
  });
  const [errors, setErrors] = useState({});
  const s = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const subtotal = Number(form.totalAmount) || 0;
  const { gstAmount, grandTotal } = calcGST(subtotal);

  const validate = () => {
    const e = {};
    if (!form.clientId) e.clientId = 'Client required';
    if (!form.totalAmount || isNaN(Number(form.totalAmount))) e.totalAmount = 'Valid amount required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <form onSubmit={e => { e.preventDefault(); if (!validate()) return; onSave({ ...form, clientId: Number(form.clientId), chainId: Number(form.chainId) || null, totalAmount: subtotal, gstAmount, grandTotal, createdBy: user?.userId || 1, issuedDate: new Date().toISOString().split('T')[0], status: 'unpaid' }); }} className="space-y-4">
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
            <option value="">— None —</option>
            {chains.map(c => <option key={c.chainId} value={c.chainId}>{c.chainName}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-textSecondary mb-1">Amount (₹) *</label>
          <input type="number" value={form.totalAmount} onChange={e => s('totalAmount', e.target.value)} className={`${inputCls} ${errors.totalAmount ? 'border-danger' : ''}`} min={0} />
          {errors.totalAmount && <p className="text-xs text-danger mt-1">{errors.totalAmount}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-textSecondary mb-1">Due Date</label>
          <input type="date" value={form.dueDate} onChange={e => s('dueDate', e.target.value)} className={inputCls} />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-textSecondary mb-1">Notes</label>
          <input value={form.notes} onChange={e => s('notes', e.target.value)} className={inputCls} />
        </div>
      </div>
      <div className="bg-surface-hover rounded-xl p-4 text-sm space-y-1">
        <div className="flex justify-between"><span className="text-textSecondary">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
        <div className="flex justify-between"><span className="text-textSecondary">GST 18%</span><span>{formatCurrency(gstAmount)}</span></div>
        <div className="flex justify-between font-bold border-t border-border pt-2 mt-2"><span>Grand Total</span><span className="text-primary">{formatCurrency(grandTotal)}</span></div>
      </div>
      <div className="flex gap-3">
        <button type="submit" className="flex-1 py-2.5 bg-primary text-white font-semibold rounded-xl text-sm">Create Invoice</button>
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 border border-border text-textSecondary rounded-xl text-sm hover:bg-surface-hover">Cancel</button>
      </div>
    </form>
  );
};

const Invoices = () => {
  const toast = useToast();
  const [invoices, setInvoices] = useState(() => InvoiceStore.list());
  const [modal, setModal] = useState(null);
  const clients = ClientStore.list();
  const refresh = () => setInvoices(InvoiceStore.list());
  const getClientName = id => clients.find(c => c.clientId === Number(id))?.clientName || '—';

  const handleSave = (form) => {
    const inv = InvoiceStore.create({ ...form, invoiceNo: nextInvoiceNo() });
    ActivityStore.add(`Invoice ${inv.invoiceNo} created`, 'invoice');
    toast({ type: 'success', message: `Invoice ${inv.invoiceNo} created!` });
    refresh(); setModal(null);
  };

  const handleDelete = () => {
    InvoiceStore.delete(modal.item.invoiceId);
    toast({ type: 'info', message: 'Invoice deleted.' });
    refresh(); setModal(null);
  };

  const getPaymentSummary = (invoiceId) => {
    const payments = PaymentStore.list().filter(p => p.invoiceId === Number(invoiceId));
    return payments.reduce((sum, p) => sum + Number(p.amountPaid), 0);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-textPrimary">Invoices</h1>
      <DataTable
        data={invoices} searchFields={['invoiceNo', 'notes']}
        onAdd={() => setModal({ mode: 'add' })} addLabel="New Invoice" emptyText="No invoices yet."
        columns={[{ key: 'invoiceNo', label: 'Invoice No.' }, { key: 'client', label: 'Client' }, { key: 'grandTotal', label: 'Total' }, { key: 'paid', label: 'Paid' }, { key: 'balance', label: 'Balance' }, { key: 'status', label: 'Status' }, { key: 'dueDate', label: 'Due' }, { key: 'act', label: '' }]}
        renderRow={(row) => {
          const paid = getPaymentSummary(row.invoiceId);
          const balance = Number(row.grandTotal) - paid;
          return (
            <tr key={row.invoiceId} className="border-b border-border/50 hover:bg-surface-hover/30 transition-colors">
              <td className="px-5 py-3.5 font-mono text-sm font-semibold text-primary">{row.invoiceNo}</td>
              <td className="px-5 py-3.5 text-textPrimary text-sm">{getClientName(row.clientId)}</td>
              <td className="px-5 py-3.5 font-semibold text-textPrimary text-sm">{formatCurrency(row.grandTotal)}</td>
              <td className="px-5 py-3.5 text-success text-sm font-semibold">{formatCurrency(paid)}</td>
              <td className="px-5 py-3.5 text-danger text-sm font-semibold">{formatCurrency(balance)}</td>
              <td className="px-5 py-3.5"><StatusBadge status={row.status} /></td>
              <td className="px-5 py-3.5 text-textSecondary text-sm">{formatDate(row.dueDate)}</td>
              <td className="px-5 py-3.5">
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setModal({ mode: 'view', item: row })} className="p-1.5 rounded-lg text-textSecondary hover:text-primary hover:bg-primary/10 transition-colors"><Eye className="h-4 w-4" /></button>
                  <button onClick={() => setModal({ mode: 'delete', item: row })} className="p-1.5 rounded-lg text-textSecondary hover:text-danger hover:bg-danger/10 transition-colors"><Trash2 className="h-4 w-4" /></button>
                </div>
              </td>
            </tr>
          );
        }}
      />
      <Modal isOpen={modal?.mode === 'add'} onClose={() => setModal(null)} title="New Invoice" size="lg">
        <InvoiceForm onSave={handleSave} onCancel={() => setModal(null)} />
      </Modal>
      <Modal isOpen={modal?.mode === 'view'} onClose={() => setModal(null)} title={`Invoice ${modal?.item?.invoiceNo}`} size="lg">
        {modal?.item && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              {[['Invoice No.', modal.item.invoiceNo], ['Client', getClientName(modal.item.clientId)], ['Issued', formatDate(modal.item.issuedDate)], ['Due Date', formatDate(modal.item.dueDate)], ['Status', modal.item.status], ['Notes', modal.item.notes]].map(([l, v]) => (
                <div key={l}><p className="text-xs text-textSecondary font-semibold">{l}</p><p className="text-textPrimary font-medium mt-0.5 capitalize">{v || '—'}</p></div>
              ))}
            </div>
            <div className="bg-surface-hover rounded-xl p-4 space-y-2">
              <div className="flex justify-between"><span className="text-textSecondary">Subtotal</span><span>{formatCurrency(modal.item.totalAmount)}</span></div>
              <div className="flex justify-between"><span className="text-textSecondary">GST</span><span>{formatCurrency(modal.item.gstAmount)}</span></div>
              <div className="flex justify-between font-bold border-t border-border pt-2"><span>Grand Total</span><span className="text-primary">{formatCurrency(modal.item.grandTotal)}</span></div>
              <div className="flex justify-between text-success font-semibold"><span>Total Paid</span><span>{formatCurrency(getPaymentSummary(modal.item.invoiceId))}</span></div>
            </div>
            <button onClick={() => setModal(null)} className="w-full py-2.5 border border-border text-textSecondary rounded-xl text-sm hover:bg-surface-hover">Close</button>
          </div>
        )}
      </Modal>
      <Modal isOpen={modal?.mode === 'delete'} onClose={() => setModal(null)} title="Delete Invoice" size="sm">
        <p className="text-sm text-textSecondary mb-6">Delete <strong>{modal?.item?.invoiceNo}</strong>?</p>
        <div className="flex gap-3"><button onClick={handleDelete} className="flex-1 py-2.5 bg-danger text-white font-semibold rounded-xl text-sm">Delete</button><button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-border text-textSecondary rounded-xl text-sm">Cancel</button></div>
      </Modal>
    </div>
  );
};

export default Invoices;
