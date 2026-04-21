// Mock Authentication Service
// This simulates a real backend so the app works fully for testing/demo
// When the real Spring Boot backend is running, this is automatically bypassed

const USERS_KEY = 'ims_mock_users';
const CURRENT_USER_KEY = 'ims_mock_user';

const getUsers = () => {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const generateToken = (user) => {
  // Lightweight base64 mock token (not a real JWT — just for client-side testing)
  const payload = btoa(JSON.stringify({ userId: user.userId, email: user.email, role: user.role, exp: Date.now() + 3600000 }));
  return `mock.${payload}.sig`;
};

export const mockRegister = (fullName, email, password, role = 'SALESPERSON') => {
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    return { success: false, message: 'Email already exists' };
  }
  const user = {
    userId: Date.now(),
    fullName,
    email,
    role,
    status: 'active',
    createdAt: new Date().toISOString(),
  };
  users.push({ ...user, password }); // store for login validation
  saveUsers(users);
  return { success: true, message: 'User registered successfully', data: user };
};

export const mockLogin = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return { success: false, message: 'Invalid email or password' };
  }
  if (user.status !== 'active') {
    return { success: false, message: 'Account is inactive. Contact your admin.' };
  }
  const { password: _, ...safeUser } = user;
  const token = generateToken(safeUser);
  return { success: true, data: { token, user: safeUser } };
};

export const mockGetMe = (token) => {
  if (!token || !token.startsWith('mock.')) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp < Date.now()) return null;
    const users = getUsers();
    const user = users.find(u => u.email === payload.email);
    if (!user) return null;
    const { password: _, ...safeUser } = user;
    return safeUser;
  } catch {
    return null;
  }
};

export const isMockToken = (token) => token && token.startsWith('mock.');
