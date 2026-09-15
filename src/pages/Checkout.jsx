import { Check, LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import SectionHeader from '../components/common/SectionHeader';
import { useCart } from '../context/CartContext';
import { addCustomerOrder } from '../utils/adminStorage';
import { getSession } from '../utils/authStorage';
import { digitsOnly, isValidPhone } from '../utils/phone';

export default function Checkout() {
  const navigate = useNavigate();
  const session = getSession();
  const { cart, subtotal, clearCart } = useCart();
  const [form, setForm] = useState({ name: session?.name || '', email: session?.email || '', phone: digitsOnly(session?.phone || ''), delivery: 'Studio Pickup', address: '', payment: 'Pay on Pickup / Delivery', notes: '' });
  const [error, setError] = useState('');
  const [placed, setPlaced] = useState(null);

  if (!session || session.role === 'admin') return <section className="min-h-[70vh] pb-24 pt-36"><div className="container-lux max-w-3xl"><SectionHeader label="CHECKOUT" title="Sign in to place your order" copy="Your account connects the purchase with your contact details and order history."/><div className="mt-10 border border-black/15 bg-white/25 p-7"><LockKeyhole className="text-gold"/><p className="mt-4 text-sm leading-7 text-muted">Use a customer account to continue. Your cart will remain saved in this browser.</p><div className="mt-6 flex gap-3"><Link to="/login" state={{ from: '/checkout' }} className="bg-ink px-6 py-4 text-[10px] uppercase tracking-[.18em] text-white">Sign In</Link><Link to="/signup" state={{ from: '/checkout' }} className="border border-ink px-6 py-4 text-[10px] uppercase tracking-[.18em]">Create Account</Link></div></div></div></section>;
  if (!cart.length && !placed) return <section className="min-h-[70vh] pb-24 pt-36"><div className="container-lux"><h1 className="font-serif text-5xl">Your cart is empty.</h1><Button to="/readymade" className="mt-7">Shop Ready-Made</Button></div></section>;
  if (placed) return <section className="flex min-h-[75vh] items-center pb-24 pt-32"><div className="container-lux"><div className="mx-auto max-w-2xl border border-black/15 bg-white/30 p-9 text-center sm:p-12"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold text-gold"><Check/></div><p className="eyebrow mt-7">ORDER RECEIVED</p><h1 className="mt-4 font-serif text-5xl">Thank you for your order.</h1><p className="mt-5 text-sm leading-7 text-muted">Order <strong>{placed.id}</strong> has been recorded. STITCH can now review it from the admin order desk and contact you about pickup or delivery.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Button to="/my-activity">View / Manage Order</Button><Button to="/readymade" variant="outline">Continue Shopping</Button></div></div></div></section>;

  const submit = (event) => {
    event.preventDefault();
    setError('');
    if (!isValidPhone(form.phone)) return setError('Phone number must be exactly 10 digits.');
    if (form.delivery === 'Local Delivery' && !form.address.trim()) return setError('Please enter a delivery address.');
    const itemSummary = cart.map((item) => `${item.name}${item.size ? ` (Size ${item.size})` : ''} × ${item.quantity}`).join('; ');
    const category = cart.every((item) => item.kind === 'accessory') ? 'Accessories' : cart.every((item) => item.kind === 'readymade') ? 'Ready-Made' : 'Ready-Made & Accessories';
    const order = addCustomerOrder({ customer: form.name, item: itemSummary, category, amount: subtotal, status: 'Order Received', payment: 'Pending', notes: `${form.email} | ${form.phone} | ${form.delivery}${form.address ? ` | ${form.address}` : ''} | ${form.payment}${form.notes ? ` | ${form.notes}` : ''}` });
    const storefront = { ...order, email: form.email, phone: form.phone, delivery: form.delivery, address: form.address, paymentMethod: form.payment, customerNote: form.notes, items: cart, total: subtotal };
    try {
      const previous = JSON.parse(localStorage.getItem('stitch_store_orders') || '[]');
      localStorage.setItem('stitch_store_orders', JSON.stringify([storefront, ...(Array.isArray(previous) ? previous : [])]));
    } catch { localStorage.setItem('stitch_store_orders', JSON.stringify([storefront])); }
    clearCart();
    setPlaced(order);
  };

  return <section className="pb-24 pt-36 sm:pb-32 sm:pt-44"><div className="container-lux"><SectionHeader label="CHECKOUT" title="Complete your purchase" copy="Direct checkout is for ready-made garments and accessories only. Bespoke/custom styles continue through consultation and fitting."/><div className="mt-12 grid gap-12 lg:grid-cols-[1fr_360px]"><form onSubmit={submit} className="grid gap-5 sm:grid-cols-2"><label className="text-xs text-muted sm:col-span-2">Full name<input required className="mt-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}/></label><label className="text-xs text-muted">Email<input required type="email" className="mt-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}/></label><label className="text-xs text-muted">Phone · 10 digits<input required inputMode="numeric" pattern="[0-9]{10}" maxLength="10" className="mt-2" value={form.phone} onChange={(e) => setForm({ ...form, phone: digitsOnly(e.target.value) })} placeholder="98XXXXXXXX"/></label><label className="text-xs text-muted">Delivery<select className="mt-2" value={form.delivery} onChange={(e) => setForm({ ...form, delivery: e.target.value })}><option>Studio Pickup</option><option>Local Delivery</option></select></label><label className="text-xs text-muted">Payment<select className="mt-2" value={form.payment} onChange={(e) => setForm({ ...form, payment: e.target.value })}><option>Pay on Pickup / Delivery</option><option>Bank Transfer (confirm manually)</option></select></label>{form.delivery === 'Local Delivery' && <label className="text-xs text-muted sm:col-span-2">Delivery address<textarea required rows="3" className="mt-2" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}/></label>}<label className="text-xs text-muted sm:col-span-2">Order note<textarea rows="4" className="mt-2" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional delivery or product note"/></label>{error && <p className="sm:col-span-2 border-l-2 border-red-700 pl-3 text-sm text-red-800">{error}</p>}<Button type="submit" className="sm:col-span-2">Place Order · Rs. {subtotal.toLocaleString()}</Button></form><aside className="h-fit border border-black/15 bg-white/30 p-6 lg:sticky lg:top-28"><p className="eyebrow">YOUR ORDER</p><div className="mt-5 divide-y divide-black/10">{cart.map((item) => <div key={`${item.kind}-${item.id}-${item.size || 'standard'}`} className="flex justify-between gap-5 py-3 text-xs"><span>{item.name} {item.size ? `· ${item.size}` : ''} × {item.quantity}</span><span>Rs. {(item.price * item.quantity).toLocaleString()}</span></div>)}</div><div className="mt-5 flex justify-between border-t border-black/15 pt-5 text-sm font-medium"><span>Total</span><span>Rs. {subtotal.toLocaleString()}</span></div><p className="mt-4 text-[11px] leading-5 text-muted">Any delivery charge is confirmed separately before dispatch.</p></aside></div></div></section>;
}
