import { ArrowRight, LockKeyhole, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { images } from '../data/images';
import { loginUser } from '../utils/authStorage';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    setError('');
    const result = loginUser(form.email, form.password);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    if (result.user.role === 'admin') return navigate('/admin');
    navigate(location.state?.from || '/profile');
  };

  return (
    <section className="min-h-screen bg-[#FAF8F3] pt-[76px]">
      <div className="grid min-h-[calc(100vh-76px)] lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-charcoal lg:block">
          <img src={images.studio} alt={images.studioAlt} className="absolute inset-0 h-full w-full object-cover opacity-75" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />
          <div className="absolute inset-x-0 bottom-0 p-12 text-white xl:p-16">
            <p className="eyebrow text-[#d3b783]">STITCH CLIENT PROFILE</p>
            <p className="mt-5 max-w-lg font-serif text-5xl leading-[.98]">Keep fittings, orders and saved details together.</p>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/60">Sign in to checkout ready-made items, review purchases, measurements and wishlist selections.</p>
          </div>
        </div>

        <div className="flex items-center px-5 py-14 sm:px-10 lg:px-16 xl:px-24">
          <div className="mx-auto w-full max-w-lg">
            <p className="eyebrow">ACCOUNT</p>
            <h1 className="mt-4 font-serif text-5xl sm:text-6xl">Welcome back.</h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-muted">Sign in to your STITCH account.</p>

            {location.state?.adminRequired && <p className="mt-7 border-l-2 border-gold pl-3 text-sm leading-6 text-muted">Sign in with an administrator account to open the studio dashboard.</p>}
            {location.state?.passwordReset && <p className="mt-7 border-l-2 border-gold pl-3 text-sm leading-6 text-muted">Your password was reset. You can sign in with the new password now.</p>}

            <form onSubmit={submit} className="mt-10 space-y-6 border-t border-black/15 pt-8">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[.16em] text-muted"><Mail size={14}/> Email</span>
                <input type="email" required autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" />
              </label>
              <label className="block">
                <span className="mb-2 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[.16em] text-muted"><span className="flex items-center gap-2"><LockKeyhole size={14}/> Password</span><Link to="/forgot-password" className="normal-case tracking-normal text-gold hover:underline">Forgot password?</Link></span>
                <input type="password" required autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Enter your password" />
              </label>
              {error && <p className="border-l-2 border-red-700 pl-3 text-sm text-red-800">{error}</p>}
              <button className="focus-lux flex w-full items-center justify-center gap-3 bg-ink px-6 py-4 text-[11px] uppercase tracking-[.2em] text-white transition-colors hover:bg-gold">Sign In <ArrowRight size={16}/></button>
            </form>

            <div className="mt-8 border-t border-black/10 pt-6 text-sm text-muted">New to Stitch? <Link to="/signup" className="border-b border-gold pb-1 text-ink hover:text-gold">Create an account</Link></div>
            <p className="mt-5 text-[11px] leading-5 text-muted/70">Current project note: customer accounts are stored in this browser. A live commercial site should use secure server-side authentication.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
