import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Users, FileText, Receipt, CreditCard, TrendingUp, Clock } from 'lucide-react';
import { getDashboardMetrics, ActivityStore } from '../../api/mockStore';
import { formatCurrency, relativeTime } from '../../utils/helpers';

const KPICard = ({ title, value, subtitle, icon: Icon, color }) => (
  <div className="glass-panel border border-border rounded-2xl p-6 hover:border-primary/30 transition-all">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-textSecondary uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-extrabold text-textPrimary mt-2">{value}</p>
        {subtitle && <p className="text-xs text-textSecondary mt-2">{subtitle}</p>}
      </div>
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  </div>
);

const activityColors = { payment: 'bg-success', estimate: 'bg-primary', client: 'bg-secondary', invoice: 'bg-warning', info: 'bg-textSecondary' };

const DashboardHome = () => {
  const user = useSelector(state => state.auth.user);
  const metrics = getDashboardMetrics();
  const activities = ActivityStore.list();

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-extrabold text-textPrimary">
          Welcome back, {user?.fullName?.split(' ')[0]} 👋
        </h1>
        <p className="text-textSecondary mt-1 text-sm">Here's what's happening across your portfolio today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <KPICard
          title="Active Clients"
          value={metrics.totalClients}
          subtitle="Across all chains"
          icon={Users}
          color="bg-primary/10 text-primary"
        />
        <KPICard
          title="Total Revenue"
          value={formatCurrency(metrics.totalRevenue)}
          subtitle="Payments collected"
          icon={TrendingUp}
          color="bg-success/10 text-success"
        />
        <KPICard
          title="Pending Estimates"
          value={metrics.pendingEstimates}
          subtitle="Awaiting approval"
          icon={FileText}
          color="bg-warning/10 text-warning"
        />
        <KPICard
          title="Outstanding"
          value={formatCurrency(metrics.unpaidAmount)}
          subtitle="Unpaid invoices"
          icon={CreditCard}
          color="bg-danger/10 text-danger"
        />
      </div>

      {/* Invoice Status + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Breakdown */}
        <div className="glass-panel border border-border rounded-2xl p-6">
          <h3 className="font-bold text-textPrimary mb-5">Invoice Status</h3>
          <div className="space-y-4">
            {[
              { label: 'Paid', count: metrics.invoiceStats.paid, color: 'bg-success', text: 'text-success' },
              { label: 'Partial', count: metrics.invoiceStats.partial, color: 'bg-warning', text: 'text-warning' },
              { label: 'Unpaid', count: metrics.invoiceStats.unpaid, color: 'bg-danger', text: 'text-danger' },
            ].map(({ label, count, color, text }) => {
              const total = metrics.invoiceStats.paid + metrics.invoiceStats.partial + metrics.invoiceStats.unpaid;
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className={`font-semibold ${text}`}>{label}</span>
                    <span className="text-textSecondary">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-surface-hover rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <Link to="/dashboard/invoices" className="mt-6 block text-center text-sm font-semibold text-primary hover:underline">
            View All Invoices →
          </Link>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-2 glass-panel border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-textPrimary">Recent Activity</h3>
            <Clock className="h-4 w-4 text-textSecondary" />
          </div>
          <div className="space-y-4">
            {activities.slice(0, 6).map(a => (
              <div key={a.id} className="flex items-start gap-3">
                <div className={`h-2 w-2 rounded-full mt-2 shrink-0 ${activityColors[a.type] || 'bg-border'}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-textPrimary">{a.message}</p>
                  <p className="text-xs text-textSecondary mt-0.5">{relativeTime(a.createdAt)}</p>
                </div>
              </div>
            ))}
            {activities.length === 0 && <p className="text-textSecondary text-sm text-center py-8">No activity yet.</p>}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="font-bold text-textPrimary mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'New Estimate', to: '/dashboard/estimates', icon: FileText, color: 'text-primary border-primary/20 hover:border-primary hover:bg-primary/5' },
            { label: 'New Invoice', to: '/dashboard/invoices', icon: Receipt, color: 'text-warning border-warning/20 hover:border-warning hover:bg-warning/5' },
            { label: 'Record Payment', to: '/dashboard/payments', icon: CreditCard, color: 'text-success border-success/20 hover:border-success hover:bg-success/5' },
            { label: 'Add Client', to: '/dashboard/clients', icon: Users, color: 'text-secondary border-secondary/20 hover:border-secondary hover:bg-secondary/5' },
          ].map(({ label, to, icon: Icon, color }) => (
            <Link key={label} to={to} className={`glass-panel border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${color}`}>
              <Icon className="h-6 w-6" />
              <span className="text-sm font-semibold">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
