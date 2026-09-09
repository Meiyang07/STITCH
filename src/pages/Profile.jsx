import { CalendarDays, Heart, LogOut, Ruler, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SectionHeader from '../components/common/SectionHeader';
import { getSession, logoutUser, updateProfile } from '../utils/authStorage';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getSession());
  const [form, setForm] = useState({ name: '', phone: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name || '', phone: user.phone || '' });
  }, [user]);

  if (!user) {
    return (
      <section className="pb-24 pt-36 sm:pb-32 sm:pt-44">
        <div className="container-lux max-w-4xl">
          <SectionHeader label="PROFILE" title="Your Stitch Account" copy="Sign in to keep your profile, measurements and tailoring preferences together." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <Link to="/login" className="focus-lux bg-ink px-6 py-5 text-center text-[11px] uppercase tracking-[.2em] text-white">Sign In</Link>
            <Link to="/signup" className="focus-lux border border-ink px-6 py-5 text-center text-[11px] uppercase tracking-[.2em]">Create Account</Link>
          </div>
          <div className="mt-12 border-t border-black/15 pt-8">
            <Link to="/measurements" className="inline-flex items-center gap-3 text-sm hover:text-gold"><Ruler size={18}/> Measurement Guide is still available without logging in.</Link>
          </div>
        </div>
      </section>
    );
  }

  const save = (event) => {
    event.preventDefault();
    const updated = updateProfile(form);
    if (updated) {
      setUser(updated);
      setSaved(true);
    }
  };

  const logout = () => {
    logoutUser();
    navigate('/login');
  };

  const shortcuts = [
    ['Measurements', '/measurements', Ruler, 'View or update your saved body measurements.'],
    ['Wishlist', '/wishlist', Heart, 'Return to styles and fabrics you saved.'],
    ['Appointments', '/appointment', CalendarDays, 'Start or review your appointment details.'],
  ];

  return (
    <section className="pb-24 pt-36 sm:pb-32 sm:pt-44">
      <div className="container-lux">
        <div className="flex flex-col gap-8 border-b border-black/15 pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">PROFILE</p>
            <h1 className="mt-4 font-serif text-5xl sm:text-6xl">Welcome, {user.name?.split(' ')[0] || 'Client'}</h1>
            <p className="mt-4 text-sm text-muted">{user.email}</p>
          </div>
          <button onClick={logout} className="focus-lux inline-flex items-center gap-2 self-start border border-black/20 px-5 py-3 text-[10px] uppercase tracking-[.18em] hover:border-gold hover:text-gold md:self-auto"><LogOut size={15}/> Sign Out</button>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_.9fr]">
          <div>
            <div className="mb-6 flex items-center gap-3"><UserRound size={20}/><h2 className="font-serif text-3xl">Personal Details</h2></div>
            <form onSubmit={save} className="space-y-5 border border-black/15 bg-white/30 p-6 sm:p-8">
              <label className="block"><span className="mb-2 block text-xs uppercase tracking-[.15em] text-muted">Full Name</span><input value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); setSaved(false); }} /></label>
              <label className="block"><span className="mb-2 block text-xs uppercase tracking-[.15em] text-muted">Email</span><input value={user.email} disabled className="opacity-60" /></label>
              <label className="block"><span className="mb-2 block text-xs uppercase tracking-[.15em] text-muted">Phone</span><input value={form.phone} onChange={(e) => { setForm({ ...form, phone: e.target.value }); setSaved(false); }} /></label>
              <div className="flex items-center gap-4"><button className="focus-lux bg-ink px-6 py-4 text-[10px] uppercase tracking-[.18em] text-white">Save Profile</button>{saved && <span className="text-xs text-gold">Profile saved.</span>}</div>
            </form>
          </div>

          <div>
            <h2 className="font-serif text-3xl">Your Tailoring Tools</h2>
            <div className="mt-6 divide-y divide-black/15 border-y border-black/15">
              {shortcuts.map(([label, to, Icon, copy]) => (
                <Link key={to} to={to} className="group flex items-start gap-4 py-6">
                  <Icon size={19} className="mt-1 text-gold"/>
                  <div><p className="font-medium group-hover:text-gold">{label}</p><p className="mt-1 text-sm leading-6 text-muted">{copy}</p></div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
