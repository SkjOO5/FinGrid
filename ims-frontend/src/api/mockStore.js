// ============================================================
// FinGrid Mock Data Store — localStorage-persisted "database"
// Acts as a full-stack backend when the Spring Boot API is offline
// ============================================================

const KEYS = {
  groups: 'fg_groups',
  chains: 'fg_chains',
  brands: 'fg_brands',
  subzones: 'fg_subzones',
  clients: 'fg_clients',
  estimates: 'fg_estimates',
  invoices: 'fg_invoices',
  payments: 'fg_payments',
  users: 'fg_users',
  activities: 'fg_activities',
};

const get = (key) => { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } };
const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const uid = () => Date.now() + Math.floor(Math.random() * 10000);
const now = () => new Date().toISOString();

// ─── Seed data so app doesn't feel empty ───────────────────
export const seedIfEmpty = () => {
  if (get(KEYS.groups).length > 0) return; // already seeded

  const groups = [
    { groupId: 1, groupName: 'Horizon Group', description: 'Western chain operations', createdAt: '2024-01-10T10:00:00Z' },
    { groupId: 2, groupName: 'Summit Retail', description: 'Pan-India retail group', createdAt: '2024-02-14T10:00:00Z' },
    { groupId: 3, groupName: 'coastal Ventures', description: 'South-coast franchises', createdAt: '2024-03-01T10:00:00Z' },
  ];
  const chains = [
    { chainId: 1, chainName: 'Alpha Chain', groupId: 1, createdAt: '2024-01-15T10:00:00Z' },
    { chainId: 2, chainName: 'Beta Chain', groupId: 1, createdAt: '2024-01-20T10:00:00Z' },
    { chainId: 3, chainName: 'Gamma Chain', groupId: 2, createdAt: '2024-02-20T10:00:00Z' },
  ];
  const brands = [
    { brandId: 1, brandName: 'FoodHub Pro', chainId: 1, createdAt: '2024-01-18T10:00:00Z' },
    { brandId: 2, brandName: 'QuickServe', chainId: 2, createdAt: '2024-01-25T10:00:00Z' },
    { brandId: 3, brandName: 'CaféNet', chainId: 3, createdAt: '2024-02-22T10:00:00Z' },
  ];
  const subzones = [
    { subzoneId: 1, subzoneName: 'Zone North', region: 'Delhi NCR', createdAt: '2024-01-10T10:00:00Z' },
    { subzoneId: 2, subzoneName: 'Zone West', region: 'Mumbai', createdAt: '2024-01-10T10:00:00Z' },
    { subzoneId: 3, subzoneName: 'Zone South', region: 'Bangalore', createdAt: '2024-01-10T10:00:00Z' },
  ];
  const clients = [
    { clientId: 1, clientName: 'Rajesh Khanna', email: 'rajesh@foodhub.com', phone: '9876543210', groupId: 1, chainId: 1, brandId: 1, subzoneId: 1, gstNumber: 'GST29ABCDE1234F1Z5', address: 'Connaught Place, New Delhi', status: 'active', createdAt: '2024-02-01T10:00:00Z' },
    { clientId: 2, clientName: 'Priya Sharma', email: 'priya@quickserve.in', phone: '9123456780', groupId: 1, chainId: 2, brandId: 2, subzoneId: 2, gstNumber: 'GST27GHIJK5678L2M6', address: 'Bandra West, Mumbai', status: 'active', createdAt: '2024-02-15T10:00:00Z' },
    { clientId: 3, clientName: 'Arjun Nair', email: 'arjun@cafenet.io', phone: '8899776655', groupId: 2, chainId: 3, brandId: 3, subzoneId: 3, gstNumber: 'GST29XYZ1234A5B6Y7', address: 'Indiranagar, Bangalore', status: 'inactive', createdAt: '2024-03-05T10:00:00Z' },
  ];
  const estimates = [
    { estimateId: 1, estimateNo: 'EST-2024-0001', clientId: 1, chainId: 1, createdBy: 1, totalAmount: 50000, gstAmount: 9000, grandTotal: 59000, status: 'approved', validUntil: '2024-12-31', notes: 'Annual software license', items: [{ description: 'Software License', qty: 1, rate: 50000, amount: 50000 }], createdAt: '2024-03-01T10:00:00Z' },
    { estimateId: 2, estimateNo: 'EST-2024-0002', clientId: 2, chainId: 2, createdBy: 1, totalAmount: 25000, gstAmount: 4500, grandTotal: 29500, status: 'sent', validUntil: '2024-12-31', notes: 'Maintenance contract Q2', items: [{ description: 'Maintenance Q2', qty: 1, rate: 25000, amount: 25000 }], createdAt: '2024-03-10T10:00:00Z' },
    { estimateId: 3, estimateNo: 'EST-2024-0003', clientId: 3, chainId: 3, createdBy: 1, totalAmount: 15000, gstAmount: 2700, grandTotal: 17700, status: 'draft', validUntil: '2024-12-31', notes: 'Setup services', items: [{ description: 'Setup & Config', qty: 3, rate: 5000, amount: 15000 }], createdAt: '2024-03-20T10:00:00Z' },
  ];
  const invoices = [
    { invoiceId: 1, invoiceNo: 'INV-2024-0001', estimateId: 1, clientId: 1, chainId: 1, createdBy: 1, totalAmount: 50000, gstAmount: 9000, grandTotal: 59000, status: 'paid', dueDate: '2024-04-30', issuedDate: '2024-03-01', notes: 'Annual license invoice', createdAt: '2024-03-01T10:00:00Z' },
    { invoiceId: 2, invoiceNo: 'INV-2024-0002', estimateId: 2, clientId: 2, chainId: 2, createdBy: 1, totalAmount: 25000, gstAmount: 4500, grandTotal: 29500, status: 'partial', dueDate: '2024-05-15', issuedDate: '2024-03-10', notes: 'Maintenance Q2', createdAt: '2024-03-10T10:00:00Z' },
    { invoiceId: 3, invoiceNo: 'INV-2024-0003', estimateId: null, clientId: 3, chainId: 3, createdBy: 1, totalAmount: 15000, gstAmount: 2700, grandTotal: 17700, status: 'unpaid', dueDate: '2024-06-01', issuedDate: '2024-03-20', notes: 'Setup services', createdAt: '2024-03-20T10:00:00Z' },
  ];
  const payments = [
    { paymentId: 1, invoiceId: 1, amountPaid: 59000, paymentDate: '2024-04-01', paymentMode: 'bank_transfer', transactionRef: 'TXN-20240401-001', notes: 'Full payment', createdAt: '2024-04-01T10:00:00Z' },
    { paymentId: 2, invoiceId: 2, amountPaid: 15000, paymentDate: '2024-04-10', paymentMode: 'online', transactionRef: 'TXN-20240410-002', notes: 'Partial payment', createdAt: '2024-04-10T10:00:00Z' },
  ];
  const activities = [
    { id: 1, message: 'Invoice INV-2024-0001 marked as paid', type: 'payment', createdAt: '2024-04-01T10:00:00Z' },
    { id: 2, message: 'New estimate EST-2024-0003 created', type: 'estimate', createdAt: '2024-03-20T10:00:00Z' },
    { id: 3, message: 'Client Priya Sharma added', type: 'client', createdAt: '2024-02-15T10:00:00Z' },
    { id: 4, message: 'Payment of ₹15,000 received', type: 'payment', createdAt: '2024-04-10T10:00:00Z' },
    { id: 5, message: 'Estimate EST-2024-0001 approved', type: 'estimate', createdAt: '2024-03-01T10:00:00Z' },
  ];

  save(KEYS.groups, groups);
  save(KEYS.chains, chains);
  save(KEYS.brands, brands);
  save(KEYS.subzones, subzones);
  save(KEYS.clients, clients);
  save(KEYS.estimates, estimates);
  save(KEYS.invoices, invoices);
  save(KEYS.payments, payments);
  save(KEYS.activities, activities);
};

// ─── Generic CRUD helpers ───────────────────────────────────
const makeStore = (key, idField) => ({
  list: () => get(key),
  get: (id) => get(key).find(item => item[idField] === Number(id)),
  create: (item) => {
    const all = get(key);
    const newItem = { ...item, [idField]: uid(), createdAt: now() };
    save(key, [...all, newItem]);
    return newItem;
  },
  update: (id, patch) => {
    const all = get(key).map(item => item[idField] === Number(id) ? { ...item, ...patch } : item);
    save(key, all);
    return all.find(item => item[idField] === Number(id));
  },
  delete: (id) => {
    const filtered = get(key).filter(item => item[idField] !== Number(id));
    save(key, filtered);
  },
});

export const GroupStore = makeStore(KEYS.groups, 'groupId');
export const ChainStore = makeStore(KEYS.chains, 'chainId');
export const BrandStore = makeStore(KEYS.brands, 'brandId');
export const SubzoneStore = makeStore(KEYS.subzones, 'subzoneId');
export const ClientStore = makeStore(KEYS.clients, 'clientId');
export const EstimateStore = makeStore(KEYS.estimates, 'estimateId');
export const InvoiceStore = makeStore(KEYS.invoices, 'invoiceId');
export const PaymentStore = makeStore(KEYS.payments, 'paymentId');
export const UserStore = makeStore(KEYS.users, 'userId');

// ─── Activity log ────────────────────────────────────────────
export const ActivityStore = {
  list: () => get(KEYS.activities).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 20),
  add: (message, type = 'info') => {
    const existing = get(KEYS.activities);
    save(KEYS.activities, [{ id: uid(), message, type, createdAt: now() }, ...existing]);
  },
};

// ─── Dashboard metrics ───────────────────────────────────────
export const getDashboardMetrics = () => {
  const invoices = InvoiceStore.list();
  const clients = ClientStore.list();
  const estimates = EstimateStore.list();
  const payments = PaymentStore.list();

  const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amountPaid), 0);
  const unpaid = invoices.filter(i => i.status === 'unpaid').reduce((sum, i) => sum + Number(i.grandTotal), 0);
  const pending = estimates.filter(e => e.status === 'sent' || e.status === 'draft').length;

  return {
    totalClients: clients.filter(c => c.status === 'active').length,
    totalRevenue,
    pendingEstimates: pending,
    unpaidAmount: unpaid,
    invoiceStats: {
      paid: invoices.filter(i => i.status === 'paid').length,
      partial: invoices.filter(i => i.status === 'partial').length,
      unpaid: invoices.filter(i => i.status === 'unpaid').length,
    },
  };
};

// ─── GST / Invoice numbering ────────────────────────────────
export const calcGST = (amount, rate = 18) => {
  const gst = (amount * rate) / 100;
  return { gstAmount: parseFloat(gst.toFixed(2)), grandTotal: parseFloat((amount + gst).toFixed(2)) };
};

export const nextEstimateNo = () => {
  const year = new Date().getFullYear();
  const existing = EstimateStore.list();
  const num = String(existing.length + 1).padStart(4, '0');
  return `EST-${year}-${num}`;
};

export const nextInvoiceNo = () => {
  const year = new Date().getFullYear();
  const existing = InvoiceStore.list();
  const num = String(existing.length + 1).padStart(4, '0');
  return `INV-${year}-${num}`;
};
