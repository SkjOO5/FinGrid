// FinGrid utility helpers
export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const relativeTime = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

export const statusColor = (status) => {
  const map = {
    active: 'bg-success/15 text-success',
    inactive: 'bg-danger/15 text-danger',
    paid: 'bg-success/15 text-success',
    partial: 'bg-warning/15 text-warning',
    unpaid: 'bg-danger/15 text-danger',
    draft: 'bg-textSecondary/15 text-textSecondary',
    sent: 'bg-primary/15 text-primary',
    approved: 'bg-success/15 text-success',
    rejected: 'bg-danger/15 text-danger',
  };
  return map[status] || 'bg-textSecondary/15 text-textSecondary';
};

export const paymentModeLabel = (mode) => {
  const map = { cash: 'Cash', bank_transfer: 'Bank Transfer', cheque: 'Cheque', online: 'Online' };
  return map[mode] || mode;
};

export const initials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
};
