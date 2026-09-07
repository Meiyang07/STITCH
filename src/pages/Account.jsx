import { CalendarDays, Heart, LogOut, Ruler, UserRound } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export default function Account() {
  const { session, isCustomer, logout } = useAuth();
  const { wishlist } = useWishlist();
  if (!isCustomer) return <Navigate to="/login" replace />;

  const measurements = readJson('stitch_measurements', {});
  const booking = readJson('stitch_booking', null);
  const measurementCount = Object.values(measurements).filter(Boolean).length;

  return (
    <section className="pb-24 pt-36 sm:pt-44">
      <div className="container-lux">
        <div className="flex flex-col gap-6 border-b border-black/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="eyebrow">CUSTOMER ACCOUNT</p><h1 className="section-title mt-4">Welcome, {session.name?.split(' ')[0] || 'Customer'}.</h1><p className="mt-4 text-sm text-muted">Your Stitch details saved in this browser.</p></div>
          <button onClick={logout} className="focus-lux inline-flex items-center gap-2 self-start border border-black/20 px-5 py-3 text-[10px] uppercase tracking-[.16em] hover:border-gold hover:text-gold"><LogOut size={15}/> Sign Out</button>
        </div>

        <div className="mt-10 grid gap-px bg-black/15 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-cream p-6"><UserRound size={20}/><p className="mt-5 text-[10px] uppercase tracking-[.18em] text-muted">PROFILE</p><p className="mt-2 font-serif text-2xl">{session.name}</p><p className="mt-2 text-xs text-muted">{session.email}</p><p className="mt-1 text-xs text-muted">{session.phone}</p></div>
          <Link to="/wishlist" className="bg-cream p-6 transition-colors hover:bg-white/60"><Heart size={20}/><p className="mt-5 text-[10px] uppercase tracking-[.18em] text-muted">WISHLIST</p><p className="mt-2 font-serif text-3xl">{wishlist.length}</p><p className="mt-2 text-xs text-muted">Saved styles and fabrics</p></Link>
          <Link to="/measurements" className="bg-cream p-6 transition-colors hover:bg-white/60"><Ruler size={20}/><p className="mt-5 text-[10px] uppercase tracking-[.18em] text-muted">MEASUREMENTS</p><p className="mt-2 font-serif text-3xl">{measurementCount}</p><p className="mt-2 text-xs text-muted">Saved measurement fields</p></Link>
          <Link to="/appointment" className="bg-cream p-6 transition-colors hover:bg-white/60"><CalendarDays size={20}/><p className="mt-5 text-[10px] uppercase tracking-[.18em] text-muted">APPOINTMENT</p><p className="mt-2 font-serif text-2xl">{booking ? 'Booked' : 'Not booked'}</p><p className="mt-2 text-xs text-muted">{booking?.date || 'Book your next fitting'}</p></Link>
        </div>

        {booking && <div className="mt-10 border border-black/15 p-6 sm:p-8"><p className="eyebrow">LATEST APPOINTMENT</p><div className="mt-5 grid gap-5 text-sm sm:grid-cols-2 lg:grid-cols-4"><div><p className="text-xs text-muted">Service</p><p className="mt-1">{booking.service || '—'}</p></div><div><p className="text-xs text-muted">Date</p><p className="mt-1">{booking.date || '—'}</p></div><div><p className="text-xs text-muted">Time</p><p className="mt-1">{booking.time || '—'}</p></div><div><p className="text-xs text-muted">Location</p><p className="mt-1">{booking.location || '—'}</p></div></div></div>}
      </div>
    </section>
  );
}
