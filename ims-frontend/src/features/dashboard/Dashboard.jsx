import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../auth/authSlice';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserSquare2, Building2, Store, Map,
  FileText, Receipt, CreditCard, LogOut, Moon, Sun, Menu, User, X,
  ChevronDown, Bell
} from 'lucide-react';

import DashboardHome from './DashboardHome';
import Clients from '../clients/Clients';
import Groups from '../groups/Groups';
import Chains from '../chains/Chains';
import Brands from '../brands/Brands';
import Subzones from '../subzones/Subzones';
import Estimates from '../estimates/Estimates';
import Invoices from '../invoices/Invoices';
import Payments from '../payments/Payments';
import Profile from '../profile/Profile';
import UsersPage from '../users/UsersPage';
import { seedIfEmpty } from '../../api/mockStore';

const navItems = [
  { name: 'Overview', path: '', icon: LayoutDashboard },
  { name: 'Clients', path: 'clients', icon: UserSquare2 },
  { name: 'Groups', path: 'groups', icon: Building2 },
  { name: 'Chains', path: 'chains', icon: Store },
  { name: 'Brands', path: 'brands', icon: Store },
  { name: 'Subzones', path: 'subzones', icon: Map },
  { name: 'Estimates', path: 'estimates', icon: FileText },
  { name: 'Invoices', path: 'invoices', icon: Receipt },
  { name: 'Payments', path: 'payments', icon: CreditCard },
];

const adminNav = [{ name: 'Users', path: 'users', icon: Users }];

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(state => state.auth.user);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('fg_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => { seedIfEmpty(); }, []);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('fg_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const allNav = user?.role === 'ADMIN' ? [...navItems, ...adminNav] : navItems;
  const isActive = (path) => {
    const cur = location.pathname.replace('/dashboard/', '').replace('/dashboard', '');
    return path === '' ? cur === '' || cur === '/' : cur === path || cur.startsWith(path + '/');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className={`h-16 flex items-center ${sidebarOpen ? 'px-6' : 'justify-center px-2'} border-b border-border shrink-0`}>
        {sidebarOpen ? (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-black text-xs">FG</div>
            <span className="font-extrabold text-lg text-textPrimary">FinGrid</span>
          </div>
        ) : (
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-black text-xs">FG</div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {allNav.map(item => (
          <Link
            key={item.name}
            to={`/dashboard/${item.path}`}
            onClick={() => setMobileSidebar(false)}
            title={!sidebarOpen ? item.name : ''}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
              isActive(item.path)
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-textSecondary hover:bg-surface-hover hover:text-textPrimary'
            }`}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span className="text-sm">{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Bottom User section */}
      <div className={`p-3 border-t border-border ${sidebarOpen ? '' : 'flex justify-center'}`}>
        {sidebarOpen ? (
          <Link to="/dashboard/profile" onClick={() => setMobileSidebar(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-hover transition-colors">
            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-textPrimary truncate">{user?.fullName}</p>
              <p className="text-xs text-textSecondary capitalize">{user?.role?.toLowerCase()}</p>
            </div>
          </Link>
        ) : (
          <Link to="/dashboard/profile" onClick={() => setMobileSidebar(false)} className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
            {user?.fullName?.charAt(0) || 'U'}
          </Link>
        )}
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col ${sidebarOpen ? 'w-60' : 'w-16'} transition-all duration-300 glass-panel border-r border-border border-y-0 border-l-0 shrink-0`}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {mobileSidebar && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-60 glass-panel flex flex-col border-r border-border" >
            <div className="h-16 flex items-center justify-between px-5 border-b border-border">
              <span className="font-extrabold text-lg text-textPrimary">FinGrid</span>
              <button onClick={() => setMobileSidebar(false)} className="text-textSecondary hover:text-textPrimary"><X className="h-5 w-5" /></button>
            </div>
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setMobileSidebar(false)} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 shrink-0 glass-panel border-b border-border flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => { setSidebarOpen(s => !s); setMobileSidebar(s => !s); }} className="p-2 rounded-lg text-textSecondary hover:text-textPrimary hover:bg-surface-hover transition-colors">
              <Menu className="h-5 w-5" />
            </button>
            <span className="hidden md:block text-sm font-medium text-textSecondary capitalize">
              {location.pathname.split('/').pop() || 'overview'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setDarkMode(d => !d)} className="p-2 rounded-lg text-textSecondary hover:text-textPrimary hover:bg-surface-hover transition-colors" title="Toggle theme">
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link to="/dashboard/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-surface-hover transition-colors">
              <div className="h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <span className="hidden sm:block text-sm font-semibold text-textPrimary">{user?.fullName}</span>
            </Link>
            <button onClick={handleLogout} title="Sign Out" className="p-2 rounded-lg text-danger hover:bg-danger/10 transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="" element={<DashboardHome />} />
            <Route path="clients/*" element={<Clients />} />
            <Route path="groups/*" element={<Groups />} />
            <Route path="chains/*" element={<Chains />} />
            <Route path="brands/*" element={<Brands />} />
            <Route path="subzones/*" element={<Subzones />} />
            <Route path="estimates/*" element={<Estimates />} />
            <Route path="invoices/*" element={<Invoices />} />
            <Route path="payments/*" element={<Payments />} />
            <Route path="profile/*" element={<Profile />} />
            {user?.role === 'ADMIN' && <Route path="users/*" element={<UsersPage />} />}
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
