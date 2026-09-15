import { CalendarDays, ClipboardList, Heart, LogOut, PackageCheck, Ruler, ShoppingBag, UserRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SectionHeader from '../components/common/SectionHeader';
import { getSession, logoutUser, updateProfile } from '../utils/authStorage';
import { getAdminOrders } from '../utils/adminStorage';
import { digitsOnly, isValidPhone } from '../utils/phone';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getSession());
  const [form, setForm] = useState({ name: '', phone: '' });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) setForm({ name: user.name || '', phone: digitsOnly(user.phone || '') });
  }, [user]);

  const orders = useMemo(() => {
    if (!user?.email) return [];
    try {
      const all = JSON.parse(localStorage.getItem('stitch_store_orders') || '[]');
      if (!Array.isArray(all)) return [];
      const adminOrders = new Map(getAdminOrders().map((order) => [order.id, order]));
      return all
        .filter((order) => order.email?.toLowerCase() === user.email.toLowerCase())
        .map((order) => ({ ...order, status: adminOrders.get(order.id)?.status || order.status, payment: adminOrders.get(order.id)?.payment || order.payment }));
    } catch { return []; }
  }, [user]);

  if (!user || user.role === 'admin') {
    return (
      <section className="pb-24 pt-36 sm:pb-32 sm:pt-44">
        <div className="container-lux max-w-4xl">
          <SectionHeader label="PROFILE" title="Your Stitch Account" copy="Sign in to keep your profile, ready-made purchases, measurements and tailoring preferences together." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2"><Link to="/login" className="focus-lux bg-ink px-6 py-5 text-center text-[11px] uppercase tracking-[.2em] text-white">Sign In</Link><Link to="/signup" className="focus-lux border border-ink px-6 py-5 text-center text-[11px] uppercase tracking-[.2em]">Create Account</Link></div>
          <div className="mt-12 border-t border-black/15 pt-8"><Link to="/measurements" className="inline-flex items-center gap-3 text-sm hover:text-gold"><Ruler size={18}/> Measurement Guide is still available without logging in.</Link></div>
        </div>
      </section>
    );
  }

  const save = (event) => {
    event.preventDefault(); setSaved(false); setError('');
    if (!isValidPhone(form.phone)) return setError('Phone number must be exactly 10 digits.');
    const updated = updateProfile(form);
    if (updated) { setUser(updated); setSaved(true); } else setError('Could not save the profile. Check the phone number.');
  };

  const logout = () => { logoutUser(); navigate('/login'); };

  const shortcuts = [
    ['Ready-Made', '/readymade', ShoppingBag, 'Shop standard-size pieces that can be purchased directly.'],
    ['Measurements', '/measurements', Ruler, 'View or update your saved body measurements.'],
    ['Wishlist', '/wishlist', Heart, 'Return to styles, fabrics and products you saved.'],
    ['Bookings & Orders', '/my-activity', ClipboardList, 'Review, reschedule and manage your fittings and ready-made orders.'],
    ['Book a Fitting', '/appointment', CalendarDays, 'Start a new tailoring and fitting request.'],
  ];

  return (
    <section className="pb-24 pt-36 sm:pb-32 sm:pt-44">
      <div className="container-lux">
        <div className="flex flex-col gap-8 border-b border-black/15 pb-10 md:flex-row md:items-end md:justify-between"><div><p className="eyebrow">PROFILE</p><h1 className="mt-4 font-serif text-5xl sm:text-6xl">Welcome, {user.name?.split(' ')[0] || 'Client'}</h1><p className="mt-4 text-sm text-muted">{user.email}</p></div><button onClick={logout} className="focus-lux inline-flex items-center gap-2 self-start border border-black/20 px-5 py-3 text-[10px] uppercase tracking-[.18em] hover:border-gold hover:text-gold md:self-auto"><LogOut size={15}/> Sign Out</button></div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_.9fr]">
          <div><div className="mb-6 flex items-center gap-3"><UserRound size={20}/><h2 className="font-serif text-3xl">Personal Details</h2></div><form onSubmit={save} className="space-y-5 border border-black/15 bg-white/30 p-6 sm:p-8"><label className="block"><span className="mb-2 block text-xs uppercase tracking-[.15em] text-muted">Full Name</span><input value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); setSaved(false); }}/></label><label className="block"><span className="mb-2 block text-xs uppercase tracking-[.15em] text-muted">Email</span><input value={user.email} disabled className="opacity-60"/></label><label className="block"><span className="mb-2 block text-xs uppercase tracking-[.15em] text-muted">Phone · 10 digits</span><input inputMode="numeric" pattern="[0-9]{10}" maxLength="10" value={form.phone} onChange={(e) => { setForm({ ...form, phone: digitsOnly(e.target.value) }); setSaved(false); }}/></label>{error && <p className="border-l-2 border-red-700 pl-3 text-sm text-red-800">{error}</p>}<div className="flex items-center gap-4"><button className="focus-lux bg-ink px-6 py-4 text-[10px] uppercase tracking-[.18em] text-white">Save Profile</button>{saved && <span className="text-xs text-gold">Profile saved.</span>}</div></form></div>

          <div><h2 className="font-serif text-3xl">Your STITCH tools</h2><div className="mt-6 divide-y divide-black/15 border-y border-black/15">{shortcuts.map(([label, to, Icon, copy]) => <Link key={to} to={to} className="group flex items-start gap-4 py-6"><Icon size={19} className="mt-1 text-gold"/><div><p className="font-medium group-hover:text-gold">{label}</p><p className="mt-1 text-sm leading-6 text-muted">{copy}</p></div></Link>)}</div></div>
        </div>

        <section className="mt-16 border-t border-black/15 pt-10"><div className="flex items-end justify-between gap-5"><div><p className="eyebrow">PURCHASES</p><h2 className="mt-3 font-serif text-4xl">Your ready-made orders</h2></div><Link to="/my-activity" className="hidden border-b border-gold pb-1 text-xs sm:block">Manage bookings & orders</Link></div>{orders.length ? <div className="mt-8 divide-y divide-black/10 border-y border-black/15">{orders.map((order) => <div key={order.id} className="grid gap-4 py-5 text-sm sm:grid-cols-[120px_1fr_150px_auto] sm:items-center"><div><p className="micro-meta">Order</p><p className="mt-1 font-medium">{order.id}</p></div><div><p className="line-clamp-2">{order.item}</p><p className="mt-1 text-xs text-muted">{new Date(order.createdAt).toLocaleDateString('en-NP')}</p></div><div><p className="micro-meta">Total</p><p className="mt-1">Rs. {Number(order.total || order.amount).toLocaleString()}</p></div><div className="flex items-center gap-2 text-xs text-gold"><PackageCheck size={15}/>{order.status}</div></div>)}</div> : <div className="mt-8 border border-dashed border-black/15 p-8 text-center"><p className="text-sm text-muted">No ready-made purchases yet.</p><ButtonLink/></div>}</section>
      </div>
    </section>
  );
}

function ButtonLink() {
  return <Link to="/readymade" className="mt-5 inline-block bg-ink px-5 py-3 text-[10px] uppercase tracking-[.16em] text-white">Browse Ready-Made</Link>;
}
