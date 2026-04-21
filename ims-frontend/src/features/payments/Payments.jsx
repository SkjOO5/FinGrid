import React, { useState } from 'react';
import { PaymentStore, InvoiceStore, ActivityStore } from '../../api/mockStore';
import DataTable, { StatusBadge } from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';
import { formatCurrency, formatDate, paymentModeLabel } from '../../utils/helpers';
import { Trash2 } from 'lucide-react';

const inputCls = 'w-full px-3 py-2 bg-surface border border-border rounded-xl text-textPrimary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40';

const PaymentForm = ({ onSave, onCancel }) => {
  const invoices = InvoiceStore.list().filter(i => i.status !== 'paid');
  const [form, setForm] = useState({ invoiceId: '', amountPaid: '', paymentDate: new Date().toISOString().split('T')[0], paymentMode: 'bank_transfer', transactionRef: '', notes: '' });
  const [errors, setErrors] = useState({});
  const s = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const selectedInvoice = invoices.find(i => i.invoiceId === Number(form.invoiceId));
  const paidSoFar = form.invoiceId ? PaymentStore.list().filter(p => p.invoiceId === Number(form.invoiceId)).reduce((sum, p) => sum + Number(p.amountPaid), 0) : 0;
  const balance = selectedInvoice ? Number(selectedInvoice.grandTotal) - paidSoFar : 0;

  const validate = () => {
    const e = {};
    if (!form.invoiceId) e.invoiceId = 'Invoice required';
    if (!form.amountPaid || isNaN(Number(form.amountPaid)) || Number(form.amountPaid) <= 0) e.amountPaid = 'Valid amount required';
    if (!form.paymentDate) e.paymentDate = 'Date required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <form onSubmit={e => {
      e.preventDefault();
      if (!validate()) return;
      const payment = { ...form, invoiceId: Number(form.invoiceId), amountPaid: Number(form.amountPaid) };
      onSave(payment, selectedInvoice, paidSoFar + Number(form.amountPaid));
    }} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-textSecondary mb-1">Invoice *</label>
        <select value={form.invoiceId} onChange={e => s('invoiceId', e.target.value)} className={`${inputCls} ${errors.invoiceId ? 'border-danger' : ''}`}>
          <option value="">— Select unpaid invoice —</option>
          {invoices.map(i => <option key={i.invoiceId} value={i.invoiceId}>{i.invoiceNo} — {formatCurrency(i.grandTotal)}</option>)}
        </select>
        {errors.invoiceId && <p className="text-xs text-danger mt-1">{errors.invoiceId}</p>}
        {selectedInvoice && <p className="text-xs text-textSecondary mt-1">Outstanding balance: <strong className="text-danger">{formatCurrency(balance)}</strong></p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-textSecondary mb-1">Amount Paid (₹) *</label>
          <input type="number" value={form.amountPaid} onChange={e => s('amountPaid', e.target.value)} max={balance || undefined} className={`${inputCls} ${errors.amountPaid ? 'border-danger' : ''}`} min={1} />
          {errors.amountPaid && <p className="text-xs text-danger mt-1">{errors.amountPaid}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-textSecondary mb-1">Payment Date *</label>
          <input type="date" value={form.paymentDate} onChange={e => s('paymentDate', e.target.value)} className={`${inputCls} ${errors.paymentDate ? 'border-danger' : ''}`} />
          {errors.paymentDate && <p className="text-xs text-danger mt-1">{errors.paymentDate}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-textSecondary mb-1">Payment Mode</label>
          <select value={form.paymentMode} onChange={e => s('paymentMode', e.target.value)} className={inputCls}>
            <option value="cash">Cash</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="cheque">Cheque</option>
            <option value="online">Online</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-textSecondary mb-1">Transaction Ref</label>
          <input value={form.transactionRef} onChange={e => s('transactionRef', e.target.value)} className={inputCls} placeholder="TXN-..." />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-textSecondary mb-1">Notes</label>
          <input value={form.notes} onChange={e => s('notes', e.target.value)} className={inputCls} />
        </div>
      </div>
      <div className="flex gap-3">
        <button type="submit" className="flex-1 py-2.5 bg-success text-white font-semibold rounded-xl text-sm">Record Payment</button>
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 border border-border text-textSecondary rounded-xl text-sm hover:bg-surface-hover">Cancel</button>
      </div>
    </form>
  );
};

const Payments = () => {
  const toast = useToast();
  const [payments, setPayments] = useState(() => PaymentStore.list());
  const [modal, setModal] = useState(null);
  const invoices = InvoiceStore.list();
  const refresh = () => setPayments(PaymentStore.list());
  const getInvoiceNo = id => invoices.find(i => i.invoiceId === Number(id))?.invoiceNo || '—';

  const handleSave = (form, invoice, totalPaid) => {
    const p = PaymentStore.create(form);
    // Auto-update invoice status
    const newStatus = totalPaid >= Number(invoice.grandTotal) ? 'paid' : 'partial';
    InvoiceStore.update(invoice.invoiceId, { status: newStatus });
    ActivityStore.add(`Payment of ${formatCurrency(form.amountPaid)} recorded for ${invoice.invoiceNo}`, 'payment');
    toast({ type: 'success', message: `Payment recorded. Invoice now "${newStatus}".` });
    refresh(); setModal(null);
  };

  const handleDelete = () => {
    PaymentStore.delete(modal.item.paymentId);
    toast({ type: 'info', message: 'Payment deleted.' });
    refresh(); setModal(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-textPrimary">Payments</h1>
      <DataTable
        data={payments} searchFields={['transactionRef', 'notes']}
        onAdd={() => setModal({ mode: 'add' })} addLabel="Record Payment" emptyText="No payments yet."
        columns={[{ key: 'invoiceNo', label: 'Invoice' }, { key: 'amountPaid', label: 'Amount' }, { key: 'paymentDate', label: 'Date' }, { key: 'paymentMode', label: 'Mode' }, { key: 'transactionRef', label: 'Ref' }, { key: 'act', label: '' }]}
        renderRow={(row) => (
          <tr key={row.paymentId} className="border-b border-border/50 hover:bg-surface-hover/30 transition-colors">
            <td className="px-5 py-3.5 font-mono text-sm text-primary font-semibold">{getInvoiceNo(row.invoiceId)}</td>
            <td className="px-5 py-3.5 font-bold text-success text-sm">{formatCurrency(row.amountPaid)}</td>
            <td className="px-5 py-3.5 text-textSecondary text-sm">{formatDate(row.paymentDate)}</td>
            <td className="px-5 py-3.5 text-sm"><span className="px-2.5 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-semibold">{paymentModeLabel(row.paymentMode)}</span></td>
            <td className="px-5 py-3.5 text-textSecondary text-xs font-mono">{row.transactionRef || '—'}</td>
            <td className="px-5 py-3.5">
              <button onClick={() => setModal({ mode: 'delete', item: row })} className="p-1.5 rounded-lg text-textSecondary hover:text-danger hover:bg-danger/10 transition-colors"><Trash2 className="h-4 w-4" /></button>
            </td>
          </tr>
        )}
      />
      <Modal isOpen={modal?.mode === 'add'} onClose={() => setModal(null)} title="Record Payment" size="lg">
        <PaymentForm onSave={handleSave} onCancel={() => setModal(null)} />
      </Modal>
      <Modal isOpen={modal?.mode === 'delete'} onClose={() => setModal(null)} title="Delete Payment" size="sm">
        <p className="text-sm text-textSecondary mb-6">Delete this payment record? The invoice status may need manual adjustment.</p>
        <div className="flex gap-3"><button onClick={handleDelete} className="flex-1 py-2.5 bg-danger text-white font-semibold rounded-xl text-sm">Delete</button><button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-border text-textSecondary rounded-xl text-sm">Cancel</button></div>
      </Modal>
    </div>
  );
};

export default Payments;
