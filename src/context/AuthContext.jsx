import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const SESSION_KEY = 'stitch_auth_session';
const CUSTOMERS_KEY = 'stitch_customers';

// Frontend-only demo credentials. Replace with backend authentication before production use.
const DEMO_ADMIN = {
  email: 'admin@stitch.com',
  password: 'Stitch@123',
  name: 'Stitch Admin'
};

function readJson(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

async function hashPassword(password) {
  if (window.crypto?.subtle) {
    const bytes = new TextEncoder().encode(password);
    const digest = await window.crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, '0')).join('');
  }
  return window.btoa(unescape(encodeURIComponent(password)));
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readJson(SESSION_KEY, null));

  useEffect(() => {
    try {
      if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      else window.localStorage.removeItem(SESSION_KEY);
    } catch {
      // Keep the UI usable even when browser storage is blocked.
    }
  }, [session]);

  const registerCustomer = async ({ name, email, phone, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const customers = readJson(CUSTOMERS_KEY, []);
    if (customers.some(customer => customer.email === normalizedEmail)) {
      return { ok: false, message: 'An account with this email already exists.' };
    }

    const customer = {
      id: `customer-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      passwordHash: await hashPassword(password),
      createdAt: new Date().toISOString()
    };

    try {
      window.localStorage.setItem(CUSTOMERS_KEY, JSON.stringify([...customers, customer]));
    } catch {
      return { ok: false, message: 'Your browser blocked local storage, so the demo account could not be saved.' };
    }

    const nextSession = { role: 'customer', id: customer.id, name: customer.name, email: customer.email, phone: customer.phone };
    setSession(nextSession);
    return { ok: true, session: nextSession };
  };

  const loginCustomer = async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const customers = readJson(CUSTOMERS_KEY, []);
    const customer = customers.find(item => item.email === normalizedEmail);
    if (!customer) return { ok: false, message: 'No customer account was found with that email.' };

    const passwordHash = await hashPassword(password);
    if (passwordHash !== customer.passwordHash) return { ok: false, message: 'Incorrect password.' };

    const nextSession = { role: 'customer', id: customer.id, name: customer.name, email: customer.email, phone: customer.phone };
    setSession(nextSession);
    return { ok: true, session: nextSession };
  };

  const loginAdmin = ({ email, password }) => {
    if (email.trim().toLowerCase() !== DEMO_ADMIN.email || password !== DEMO_ADMIN.password) {
      return { ok: false, message: 'Incorrect admin email or password.' };
    }
    const nextSession = { role: 'admin', name: DEMO_ADMIN.name, email: DEMO_ADMIN.email };
    setSession(nextSession);
    return { ok: true, session: nextSession };
  };

  const logout = () => setSession(null);

  const value = useMemo(() => ({
    session,
    isCustomer: session?.role === 'customer',
    isAdmin: session?.role === 'admin',
    registerCustomer,
    loginCustomer,
    loginAdmin,
    logout,
    demoAdmin: { email: DEMO_ADMIN.email, password: DEMO_ADMIN.password }
  }), [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
