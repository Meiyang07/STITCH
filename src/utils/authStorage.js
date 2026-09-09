const USERS_KEY = 'stitch_users';
const SESSION_KEY = 'stitch_session';

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

  if (users.some((item) => item.email.toLowerCase() === email)) {
    return { ok: false, message: 'An account with this email already exists.' };
  }

  const newUser = {
    id: Date.now(),
    name: user.name.trim(),
    email,
    phone: user.phone.trim(),
    password: user.password,
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
  localStorage.setItem(SESSION_KEY, JSON.stringify(stripPassword(newUser)));
  return { ok: true, user: stripPassword(newUser) };
}

export function loginUser(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = getUsers().find(
    (item) => item.email.toLowerCase() === normalizedEmail && item.password === password,
  );

  if (!user) {
    return { ok: false, message: 'Incorrect email or password.' };
  }

  const session = stripPassword(user);
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { ok: true, user: session };
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
  if (!session) return null;

  const users = getUsers();
  const updatedUsers = users.map((user) =>
    user.id === session.id ? { ...user, ...changes } : user,
  );
  const updated = updatedUsers.find((user) => user.id === session.id);

  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  localStorage.setItem(SESSION_KEY, JSON.stringify(stripPassword(updated)));
  return stripPassword(updated);
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}

function stripPassword(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}
