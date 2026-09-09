import { ArrowRight, Mail, Phone, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { images } from '../data/images';
import { createUser } from '../utils/authStorage';

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    setError('');
    if (form.password.length < 6) return setError('Use at least 6 characters for your password.');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    const result = createUser(form);
    if (!result.ok) return setError(result.message);
    navigate('/profile');
  };

  return (
    <section className="min-h-screen bg-[#FAF8F3] pt-[76px]">
      <div className="grid min-h-[calc(100vh-76px)] lg:grid-cols-[.9fr_1.1fr]">
        <div className="relative hidden overflow-hidden bg-charcoal lg:block">
          <img src={images.bespoke_feature} alt={images.bespokeFeatureAlt} className="absolute inset-0 h-full w-full object-cover opacity-75" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/20 to-black/10" />
          <div className="absolute inset-x-0 bottom-0 p-12 text-white xl:p-16">
            <p className="eyebrow text-[#d3b783]">CREATE YOUR PROFILE</p>
            <p className="mt-5 max-w-lg font-serif text-5xl leading-[.98]">A useful place for fit, preferences and saved styles.</p>
          </div>
        </div>

        <div className="flex items-center px-5 py-14 sm:px-10 lg:px-16 xl:px-24">
          <div className="mx-auto w-full max-w-2xl">
            <p className="eyebrow">CREATE ACCOUNT</p>
            <h1 className="mt-4 font-serif text-5xl sm:text-6xl">Your Stitch profile.</h1>
            <p className="mt-5 text-sm leading-7 text-muted">Save contact details and return to measurements, wishlist items and appointment planning from one profile.</p>
            <p className="mt-3 text-sm text-muted">Already registered? <Link to="/login" className="border-b border-gold pb-1 text-ink">Sign in.</Link></p>

            <form onSubmit={submit} className="mt-9 grid gap-5 border-t border-black/15 pt-8 sm:grid-cols-2">
              <label className="block sm:col-span-2"><span className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[.16em] text-muted"><UserRound size={14}/> Full Name</span><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" /></label>
              <label className="block"><span className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[.16em] text-muted"><Mail size={14}/> Email</span><input type="email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label>
              <label className="block"><span className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[.16em] text-muted"><Phone size={14}/> Phone</span><input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+977 98XXXXXXXX" /></label>
              <label className="block"><span className="mb-2 text-[10px] uppercase tracking-[.16em] text-muted">Password</span><input type="password" required autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Minimum 6 characters" /></label>
              <label className="block"><span className="mb-2 text-[10px] uppercase tracking-[.16em] text-muted">Confirm Password</span><input type="password" required autoComplete="new-password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} placeholder="Repeat password" /></label>
              {error && <p className="sm:col-span-2 border-l-2 border-red-700 pl-3 text-sm text-red-800">{error}</p>}
              <button className="focus-lux sm:col-span-2 flex w-full items-center justify-center gap-3 bg-ink px-6 py-4 text-[11px] uppercase tracking-[.2em] text-white transition-colors hover:bg-gold">Create Account <ArrowRight size={16}/></button>
            </form>
            <p className="mt-5 text-[11px] leading-5 text-muted/70">Prototype note: account data is stored locally on this device. A production account system needs secure server-side authentication.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
