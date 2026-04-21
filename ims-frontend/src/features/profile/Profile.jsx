import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess } from '../auth/authSlice';
import { useToast } from '../../components/common/Toast';
import { mockLogin, mockRegister } from '../../api/mockAuth';
import { formatDate, initials } from '../../utils/helpers';
import { User, Lock, Bell, Shield, Eye, EyeOff, Moon, Sun, CheckCircle2 } from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'password', label: 'Password', icon: Lock },
  { id: 'security', label: 'Security', icon: Shield },
];

const inputCls = 'w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-textPrimary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40';

const Profile = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const user = useSelector(s => s.auth.user);
  const token = useSelector(s => s.auth.token);
  const [tab, setTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('fg_theme') === 'dark');

  // Profile edit
  const [profileForm, setProfileForm] = useState({ fullName: user?.fullName || '', email: user?.email || '' });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileSaving, setProfileSaving] = useState(false);

  // Password change
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });

  const handleProfileSave = () => {
    const e = {};
    if (!profileForm.fullName.trim()) e.fullName = 'Name is required';
    if (!profileForm.email.trim() || !/\S+@\S+\.\S+/.test(profileForm.email)) e.email = 'Valid email required';
    if (Object.keys(e).length) { setProfileErrors(e); return; }
    setProfileErrors({});
    setProfileSaving(true);

    // Update in mock store
    const USERS_KEY = 'ims_mock_users';
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const updated = users.map(u => u.email === user.email ? { ...u, ...profileForm } : u);
    localStorage.setItem(USERS_KEY, JSON.stringify(updated));

    // Update redux state
    dispatch(loginSuccess({ token, user: { ...user, ...profileForm } }));
    setTimeout(() => { setProfileSaving(false); toast({ type: 'success', message: 'Profile updated successfully!' }); }, 500);
  };

  const handlePasswordChange = () => {
    const e = {};
    if (!pwForm.current) e.current = 'Current password required';
    if (!pwForm.newPw || pwForm.newPw.length < 6) e.newPw = 'Min. 6 characters';
    if (pwForm.newPw !== pwForm.confirm) e.confirm = 'Passwords do not match';
    if (Object.keys(e).length) { setPwErrors(e); return; }

    // Verify current password via mock
    const result = mockLogin(user.email, pwForm.current);
    if (!result.success) { setPwErrors({ current: 'Incorrect current password' }); return; }

    // Update password
    const USERS_KEY = 'ims_mock_users';
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const updated = users.map(u => u.email === user.email ? { ...u, password: pwForm.newPw } : u);
    localStorage.setItem(USERS_KEY, JSON.stringify(updated));

    setPwForm({ current: '', newPw: '', confirm: '' });
    setPwErrors({});
    toast({ type: 'success', message: 'Password changed successfully!' });
  };

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('fg_theme', next ? 'dark' : 'light');
    toast({ type: 'info', message: `Switched to ${next ? 'Dark' : 'Light'} mode.` });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-extrabold text-textPrimary mb-6">Account Settings</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 shrink-0 space-y-4">
          {/* Avatar Card */}
          <div className="glass-panel border border-border rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-black mb-4">
              {initials(user?.fullName)}
            </div>
            <p className="font-bold text-textPrimary">{user?.fullName}</p>
            <p className="text-sm text-textSecondary">{user?.email}</p>
            <span className={`mt-3 px-3 py-1 text-xs font-bold rounded-full ${user?.role === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
              {user?.role}
            </span>
            <p className="mt-3 text-xs text-textSecondary">Member since {formatDate(user?.createdAt || new Date().toISOString())}</p>
          </div>

          {/* Nav Tabs */}
          <nav className="glass-panel border border-border rounded-2xl p-2 space-y-1">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${tab === t.id ? 'bg-primary/10 text-primary font-semibold' : 'text-textSecondary hover:bg-surface-hover hover:text-textPrimary'}`}>
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Panel */}
        <div className="flex-1 glass-panel border border-border rounded-2xl p-6">
          {/* Profile Tab */}
          {tab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-textPrimary">Profile Information</h2>
                <p className="text-sm text-textSecondary mt-1">Update your name and email address.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-textSecondary mb-1">Full Name</label>
                  <input value={profileForm.fullName} onChange={e => setProfileForm(f => ({ ...f, fullName: e.target.value }))}
                    className={`${inputCls} ${profileErrors.fullName ? 'border-danger' : ''}`} />
                  {profileErrors.fullName && <p className="text-xs text-danger mt-1">{profileErrors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-textSecondary mb-1">Email Address</label>
                  <input type="email" value={profileForm.email} onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))}
                    className={`${inputCls} ${profileErrors.email ? 'border-danger' : ''}`} />
                  {profileErrors.email && <p className="text-xs text-danger mt-1">{profileErrors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-textSecondary mb-1">Role</label>
                  <input value={user?.role || ''} readOnly className={`${inputCls} opacity-60 cursor-not-allowed`} />
                  <p className="text-xs text-textSecondary mt-1">Role can only be changed by an Admin.</p>
                </div>
              </div>
              <button onClick={handleProfileSave} disabled={profileSaving}
                className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary/90 disabled:opacity-60">
                {profileSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}

          {/* Password Tab */}
          {tab === 'password' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-textPrimary">Change Password</h2>
                <p className="text-sm text-textSecondary mt-1">Choose a strong password for your account.</p>
              </div>
              <div className="space-y-4">
                {[['current', 'Current Password'], ['newPw', 'New Password'], ['confirm', 'Confirm New Password']].map(([key, label]) => (
                  <div key={key}>
                    <label className="block text-sm font-semibold text-textSecondary mb-1">{label}</label>
                    <div className="relative">
                      <input type={showPw[key] ? 'text' : 'password'} value={pwForm[key]}
                        onChange={e => setPwForm(f => ({ ...f, [key]: e.target.value }))}
                        className={`${inputCls} pr-11 ${pwErrors[key] ? 'border-danger' : ''}`} placeholder="••••••••" />
                      <button type="button" onClick={() => setShowPw(s => ({ ...s, [key]: !s[key] }))}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-textSecondary hover:text-textPrimary">
                        {showPw[key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {pwErrors[key] && <p className="text-xs text-danger mt-1">{pwErrors[key]}</p>}
                  </div>
                ))}
              </div>
              <button onClick={handlePasswordChange} className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary/90">
                Update Password
              </button>
            </div>
          )}

          {/* Security Tab */}
          {tab === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-textPrimary">Security & Preferences</h2>
                <p className="text-sm text-textSecondary mt-1">Manage your security settings and preferences.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 glass-panel rounded-xl border border-border">
                  <div className="flex items-center gap-3">
                    {darkMode ? <Moon className="h-5 w-5 text-secondary" /> : <Sun className="h-5 w-5 text-warning" />}
                    <div>
                      <p className="text-sm font-semibold text-textPrimary">Theme</p>
                      <p className="text-xs text-textSecondary">Currently: {darkMode ? 'Dark' : 'Light'} mode</p>
                    </div>
                  </div>
                  <button onClick={toggleTheme} className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-primary' : 'bg-border'}`}>
                    <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 glass-panel rounded-xl border border-border">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-success" />
                    <div>
                      <p className="text-sm font-semibold text-textPrimary">Account Status</p>
                      <p className="text-xs text-textSecondary">Your account is active and secure</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 text-success text-xs font-semibold"><CheckCircle2 className="h-4 w-4" />Active</span>
                </div>
                <div className="p-4 glass-panel rounded-xl border border-border">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-textPrimary">Session Info</p>
                      <p className="text-xs text-textSecondary">Logged in as <strong>{user?.email}</strong> · Role: <strong>{user?.role}</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
