import { digitsOnly, isValidPhone } from './phone';

const USERS_KEY = 'stitch_users';
const SESSION_KEY = 'stitch_session';
const ADMIN_EMAIL = 'admin@stitch.com';
const ADMIN_PASSWORD = 'Stitch@123';

export function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function createUser(user) {
  const users = getUsers();
  const email = user.email.trim().toLowerCase();
  const phone = digitsOnly(user.phone);

  if (!isValidPhone(phone)) {
    return { ok: false, message: 'Phone number must be exactly 10 digits.' };
  }

  if (users.some((item) => item.email.toLowerCase() === email)) {
    return { ok: false, message: 'An account with this email already exists.' };
  }

  const newUser = {
    id: Date.now(),
    name: user.name.trim(),
    email,
    phone,
    password: user.password,
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
  localStorage.setItem(SESSION_KEY, JSON.stringify({ ...stripPassword(newUser), role: 'customer' }));
  return { ok: true, user: { ...stripPassword(newUser), role: 'customer' } };
}

export function loginUser(email, password) {
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const adminSession = {
      id: 'stitch-admin',
      name: 'STITCH Admin',
      email: ADMIN_EMAIL,
      role: 'admin',
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(adminSession));
    return { ok: true, user: adminSession };
  }

  const user = getUsers().find(
    (item) => item.email.toLowerCase() === normalizedEmail && item.password === password,
  );

  if (!user) {
    return { ok: false, message: 'Incorrect email or password.' };
  }

  const session = { ...stripPassword(user), role: 'customer' };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { ok: true, user: session };
}

export function resetPassword(email, phone, newPassword) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPhone = digitsOnly(phone);
  if (normalizedEmail === ADMIN_EMAIL) return { ok: false, message: 'Administrator password recovery is not available from the customer login.' };
  if (!isValidPhone(normalizedPhone)) return { ok: false, message: 'Phone number must be exactly 10 digits.' };

  const users = getUsers();
  const index = users.findIndex((user) => user.email.toLowerCase() === normalizedEmail && digitsOnly(user.phone) === normalizedPhone);
  if (index < 0) return { ok: false, message: 'No customer account matches that email and phone number.' };

  const next = [...users];
  next[index] = { ...next[index], password: newPassword };
  localStorage.setItem(USERS_KEY, JSON.stringify(next));
  return { ok: true };
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  } catch {
    return null;
  }
}

export function updateProfile(changes) {
  const session = getSession();
  if (!session || session.role === 'admin') return null;

  const normalized = { ...changes };
  if ('phone' in normalized) {
    normalized.phone = digitsOnly(normalized.phone);
    if (!isValidPhone(normalized.phone)) return null;
  }

  const users = getUsers();
  const updatedUsers = users.map((user) => user.id === session.id ? { ...user, ...normalized } : user);
  const updated = updatedUsers.find((user) => user.id === session.id);
  if (!updated) return null;

  const safe = { ...stripPassword(updated), role: 'customer' };
  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  localStorage.setItem(SESSION_KEY, JSON.stringify(safe));
  return safe;
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}

function stripPassword(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}
