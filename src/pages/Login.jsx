import { Eye, EyeOff, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });
  const { session, loginCustomer, registerCustomer, loginAdmin, demoAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session?.role === 'customer') navigate('/account', { replace: true });
    if (session?.role === 'admin') navigate('/admin', { replace: true });
  }, [session, navigate]);

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (!form.email.includes('@') || form.password.length < 6) {
      setMessage('Enter a valid email and a password with at least 6 characters.');
      return;
    }

    if (mode === 'register') {
      if (!form.name.trim() || !form.phone.trim()) {
        setMessage('Please enter your name and phone number.');
        return;
      }

      setLoading(true);
      const result = await registerCustomer(form);
      setLoading(false);
      if (!result.ok) setMessage(result.message);
      return;
    }

    setLoading(true);

    // One login form for everyone. Admin credentials are recognized automatically;
    // all other credentials are checked against registered customer accounts.
    let result;
    if (form.email.trim().toLowerCase() === demoAdmin.email) {
      result = loginAdmin({ email: form.email, password: form.password });
    } else {
      result = await loginCustomer({ email: form.email, password: form.password });
    }

    setLoading(false);
    if (!result.ok) setMessage(result.message);
  };

  return (
    <section className="min-h-screen bg-cream pb-20 pt-28 sm:pt-36">
      <div className="container-lux">
        <div className="mx-auto max-w-5xl overflow-hidden border border-black/15 bg-white/35 lg:grid lg:grid-cols-[.85fr_1.15fr]">
          <div className="bg-ink p-8 text-cream sm:p-10 lg:p-12">
            <p className="eyebrow text-[#c3a674]">STITCH ACCOUNT</p>
            <h1 className="mt-5 font-serif text-5xl leading-[.95] sm:text-6xl">Your fittings, details and appointments in one place.</h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-white/60">
              One sign-in works for both customers and Stitch staff. The account type is recognized automatically from the login details.
            </p>
            <div className="mt-10 space-y-5 border-t border-white/15 pt-8 text-sm text-white/60">
              <div className="flex gap-3"><UserRound className="mt-0.5 text-gold" size={18}/><span>Customer profile and saved tailoring information</span></div>
              <div className="flex gap-3"><LockKeyhole className="mt-0.5 text-gold" size={18}/><span>One login form for customers and administrators</span></div>
              <div className="flex gap-3"><ShieldCheck className="mt-0.5 text-gold" size={18}/><span>Frontend demo only — production authentication needs a backend</span></div>
            </div>
          </div>

          <div className="p-6 sm:p-10 lg:p-12">
            <div className="flex items-end justify-between gap-4 border-b border-black/15 pb-5">
              <div>
                <p className="eyebrow">ACCOUNT ACCESS</p>
                <h2 className="mt-2 font-serif text-4xl">{mode === 'login' ? 'Welcome Back' : 'Create An Account'}</h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setMessage('');
                }}
                className="focus-lux text-[10px] uppercase tracking-[.14em] text-gold"
              >
                {mode === 'login' ? 'Create Account' : 'Sign In'}
              </button>
            </div>

            <form className="mt-7 space-y-5" onSubmit={submit}>
              {mode === 'register' && <>
                <label className="block text-xs text-muted">Full Name<input className="mt-2" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} autoComplete="name" /></label>
                <label className="block text-xs text-muted">Phone Number<input className="mt-2" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+977" autoComplete="tel" /></label>
              </>}

              <label className="block text-xs text-muted">Email Address<input className="mt-2" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} autoComplete="email" required /></label>

              <label className="block text-xs text-muted">Password
                <div className="relative mt-2">
                  <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required className="pr-12" />
                  <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)} className="focus-lux absolute right-3 top-1/2 -translate-y-1/2 p-2 text-muted">{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button>
                </div>
              </label>

              {message && <p className="border-l-2 border-gold bg-black/[.03] px-4 py-3 text-xs leading-6 text-muted">{message}</p>}

              <button disabled={loading} className="focus-lux w-full bg-ink px-6 py-4 text-[10px] uppercase tracking-[.2em] text-white disabled:opacity-50">
                {loading ? 'Please Wait...' : mode === 'login' ? 'Sign In' : 'Create Customer Account'}
              </button>
            </form>

            {mode === 'login' ? (
              <div className="mt-6 border border-black/10 bg-[#eee8de] p-4 text-xs leading-6 text-muted">
                <p className="font-medium text-ink">Demo admin credentials</p>
                <p>Email: {demoAdmin.email}</p>
                <p>Password: {demoAdmin.password}</p>
                <p className="mt-2">Use the same form above. Admin access is detected automatically.</p>
              </div>
            ) : (
              <p className="mt-5 text-xs leading-6 text-muted">This project has no backend. Customer accounts are stored only in this browser for demonstration.</p>
            )}

            <div className="mt-8 border-t border-black/15 pt-5 text-xs text-muted"><Link className="hover:text-gold" to="/">← Return to Stitch</Link></div>
          </div>
        </div>
      </div>
    </section>
  );
}
