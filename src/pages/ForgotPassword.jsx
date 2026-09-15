import { ArrowRight, KeyRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resetPassword } from '../utils/authStorage';
import { digitsOnly, isValidPhone } from '../utils/phone';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const submit = (event) => {
    event.preventDefault(); setError('');
    if (!isValidPhone(form.phone)) return setError('Phone number must be exactly 10 digits.');
    if (form.password.length < 6) return setError('Use at least 6 characters for your new password.');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    const result = resetPassword(form.email, form.phone, form.password);
    if (!result.ok) return setError(result.message);
    navigate('/login', { state: { passwordReset: true } });
  };
  return <section className="min-h-screen bg-[#FAF8F3] pb-20 pt-36"><div className="container-lux max-w-xl"><KeyRound className="text-gold"/><p className="eyebrow mt-6">ACCOUNT RECOVERY</p><h1 className="mt-4 font-serif text-5xl sm:text-6xl">Reset your password.</h1><p className="mt-5 text-sm leading-7 text-muted">For this frontend version, we verify the email and 10-digit phone saved with your customer account before allowing a new password.</p><form onSubmit={submit} className="mt-9 space-y-5 border-t border-black/15 pt-8"><label className="block text-xs text-muted">Email<input required type="email" className="mt-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}/></label><label className="block text-xs text-muted">Registered phone · 10 digits<input required inputMode="numeric" pattern="[0-9]{10}" maxLength="10" className="mt-2" value={form.phone} onChange={(e) => setForm({ ...form, phone: digitsOnly(e.target.value) })} placeholder="98XXXXXXXX"/></label><label className="block text-xs text-muted">New password<input required type="password" className="mt-2" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}/></label><label className="block text-xs text-muted">Confirm new password<input required type="password" className="mt-2" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })}/></label>{error && <p className="border-l-2 border-red-700 pl-3 text-sm text-red-800">{error}</p>}<button className="focus-lux flex w-full items-center justify-center gap-3 bg-ink px-6 py-4 text-[11px] uppercase tracking-[.2em] text-white hover:bg-gold">Reset Password <ArrowRight size={16}/></button></form><p className="mt-7 text-sm text-muted"><Link to="/login" className="border-b border-gold pb-1 text-ink">Back to login</Link></p><p className="mt-5 text-[11px] leading-5 text-muted/70">For a production website, password reset should use a secure server-generated email/SMS token rather than browser storage.</p></div></section>;
}
