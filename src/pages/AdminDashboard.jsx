import { CalendarDays, LogOut, Scissors, ShieldCheck, UsersRound } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export default function AdminDashboard() {
  const { isAdmin, session, logout } = useAuth();
  if (!isAdmin) return <Navigate to="/login" replace />;

  const customers = readJson('stitch_customers', []);
  const booking = readJson('stitch_booking', null);
  const measurements = readJson('stitch_measurements', {});

  return (
    <section className="min-h-screen bg-[#eee8de] pb-24 pt-32">
      <div className="container-lux">
        <div className="flex flex-col gap-6 border-b border-black/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div><div className="flex items-center gap-2 text-gold"><ShieldCheck size={18}/><p className="text-[10px] uppercase tracking-[.22em]">ADMIN AREA</p></div><h1 className="section-title mt-4">Stitch Dashboard</h1><p className="mt-4 text-sm text-muted">Signed in as {session.email}</p></div>
          <button onClick={logout} className="focus-lux inline-flex items-center gap-2 self-start border border-black/20 px-5 py-3 text-[10px] uppercase tracking-[.16em] hover:border-gold hover:text-gold"><LogOut size={15}/> Sign Out</button>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="border border-black/15 bg-cream p-7"><UsersRound size={21}/><p className="mt-6 text-[10px] uppercase tracking-[.18em] text-muted">REGISTERED CUSTOMERS</p><p className="mt-2 font-serif text-5xl">{customers.length}</p></div>
          <div className="border border-black/15 bg-cream p-7"><CalendarDays size={21}/><p className="mt-6 text-[10px] uppercase tracking-[.18em] text-muted">DEMO BOOKINGS</p><p className="mt-2 font-serif text-5xl">{booking ? 1 : 0}</p></div>
          <div className="border border-black/15 bg-cream p-7"><Scissors size={21}/><p className="mt-6 text-[10px] uppercase tracking-[.18em] text-muted">SAVED MEASUREMENT SETS</p><p className="mt-2 font-serif text-5xl">{Object.keys(measurements).length ? 1 : 0}</p></div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="border border-black/15 bg-cream p-6 sm:p-8"><p className="eyebrow">CUSTOMERS</p>{customers.length ? <div className="mt-6 divide-y divide-black/10">{customers.map(customer => <div className="py-4" key={customer.id}><p className="font-medium">{customer.name}</p><p className="mt-1 text-xs text-muted">{customer.email} · {customer.phone}</p></div>)}</div> : <p className="mt-6 text-sm text-muted">No customer has registered in this browser yet.</p>}</div>
          <div className="border border-black/15 bg-cream p-6 sm:p-8"><p className="eyebrow">LATEST APPOINTMENT</p>{booking ? <div className="mt-6 space-y-4 text-sm"><div><p className="text-xs text-muted">Customer</p><p>{booking.name || booking.fullName || 'Customer'}</p></div><div><p className="text-xs text-muted">Service</p><p>{booking.service || '—'}</p></div><div><p className="text-xs text-muted">Date & time</p><p>{booking.date || '—'} {booking.time ? `· ${booking.time}` : ''}</p></div><div><p className="text-xs text-muted">Contact</p><p>{booking.email || booking.phone || '—'}</p></div></div> : <p className="mt-6 text-sm text-muted">No appointment has been confirmed in this browser.</p>}</div>
        </div>

        <p className="mt-8 max-w-3xl text-xs leading-6 text-muted">This admin dashboard is a frontend demonstration using browser localStorage. Do not use the demo credentials or localStorage authentication for a real production admin system.</p>
      </div>
    </section>
  );
}
