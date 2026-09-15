import { CalendarDays, ChevronDown, ChevronUp, Clock3, MapPin, PackageCheck, Pencil, ShoppingBag, XCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import SectionHeader from '../components/common/SectionHeader';
import { getAdminOrders, updateAppointmentStatus, updateCustomerOrderContact } from '../utils/adminStorage';
import { getSession } from '../utils/authStorage';

function readArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function readLatestBooking() {
  try {
    return JSON.parse(localStorage.getItem('stitch_booking') || 'null');
  } catch {
    return null;
  }
}

function statusTone(status = '') {
  const value = status.toLowerCase();
  if (value.includes('cancel')) return 'border-red-900/15 bg-red-950/[.04] text-red-800';
  if (value.includes('complete') || value.includes('ready')) return 'border-emerald-900/15 bg-emerald-950/[.04] text-emerald-800';
  if (value.includes('pending') || value.includes('received')) return 'border-amber-900/15 bg-amber-950/[.04] text-amber-800';
  return 'border-black/10 bg-white/35 text-ink';
}

function readableDate(value) {
  if (!value) return 'Not set';
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function MyActivity() {
  const session = getSession();
  const [revision, setRevision] = useState(0);
  const [openBooking, setOpenBooking] = useState('');
  const [openOrder, setOpenOrder] = useState('');
  const [editingOrder, setEditingOrder] = useState('');
  const [orderEdit, setOrderEdit] = useState({ delivery: 'Studio Pickup', address: '', customerNote: '' });
  const [savedOrder, setSavedOrder] = useState('');

  useEffect(() => {
    const refresh = () => setRevision((value) => value + 1);
    window.addEventListener('focus', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const { bookings, orders, identityEmail } = useMemo(() => {
    const latest = readLatestBooking();
    const email = session?.role === 'customer' ? session.email?.toLowerCase() : latest?.email?.toLowerCase();
    const storedBookings = readArray('stitch_bookings');
    const allBookings = storedBookings.length ? storedBookings : latest ? [latest] : [];
    const visibleBookings = email
      ? allBookings.filter((booking) => booking.email?.toLowerCase() === email)
      : latest ? allBookings.filter((booking) => booking.id === latest.id) : [];

    const storefrontOrders = readArray('stitch_store_orders');
    const adminMap = new Map(getAdminOrders().map((order) => [order.id, order]));
    const visibleOrders = session?.role === 'customer' && session.email
      ? storefrontOrders
        .filter((order) => order.email?.toLowerCase() === session.email.toLowerCase())
        .map((order) => ({
          ...order,
          status: adminMap.get(order.id)?.status || order.status,
          payment: adminMap.get(order.id)?.payment || order.payment,
          paidAmount: adminMap.get(order.id)?.paidAmount ?? order.paidAmount,
        }))
      : [];

    return { bookings: visibleBookings, orders: visibleOrders, identityEmail: email || '' };
  }, [revision, session?.email, session?.role]);

  const cancelBooking = (booking) => {
    if (!window.confirm(`Cancel fitting request ${booking.id}?`)) return;
    updateAppointmentStatus(booking.id, 'Cancelled');
    setRevision((value) => value + 1);
  };

  const beginOrderEdit = (order) => {
    setSavedOrder('');
    setEditingOrder(order.id);
    setOrderEdit({
      delivery: order.delivery || 'Studio Pickup',
      address: order.address || '',
      customerNote: order.customerNote || '',
    });
  };

  const saveOrderEdit = (order) => {
    if (orderEdit.delivery === 'Local Delivery' && !orderEdit.address.trim()) return;
    const adminNotes = `${order.email || ''} | ${order.phone || ''} | ${orderEdit.delivery}${orderEdit.address.trim() ? ` | ${orderEdit.address.trim()}` : ''} | ${order.paymentMethod || 'Pay on Pickup / Delivery'}${orderEdit.customerNote.trim() ? ` | ${orderEdit.customerNote.trim()}` : ''}`;
    const all = readArray('stitch_store_orders');
    localStorage.setItem('stitch_store_orders', JSON.stringify(all.map((item) => item.id === order.id ? {
      ...item,
      delivery: orderEdit.delivery,
      address: orderEdit.delivery === 'Local Delivery' ? orderEdit.address.trim() : '',
      customerNote: orderEdit.customerNote.trim(),
      notes: adminNotes,
      updatedAt: new Date().toISOString(),
    } : item)));
    updateCustomerOrderContact(order.id, { notes: adminNotes });
    setEditingOrder('');
    setSavedOrder(order.id);
    setRevision((value) => value + 1);
  };

  return (
    <section className="pb-24 pt-36 sm:pb-32 sm:pt-44">
      <div className="container-lux">
        <SectionHeader
          label="YOUR REQUESTS"
          title="Bookings & Orders"
          copy="Review your fitting requests and ready-made orders in one place. Fittings can be changed or rescheduled, and newly placed orders can still have their delivery details adjusted before processing begins."
        />

        {!session && identityEmail && (
          <div className="mt-8 border-l-2 border-gold bg-white/25 px-5 py-4 text-sm leading-6 text-muted">
            You are viewing fitting requests saved in this browser for <strong className="font-medium text-ink">{identityEmail}</strong>. Sign in to also see your ready-made order history.
          </div>
        )}

        <div className="mt-12 grid gap-14 xl:grid-cols-2">
          <section>
            <div className="flex items-end justify-between gap-4 border-b border-black/15 pb-5">
              <div><p className="eyebrow">FITTINGS</p><h2 className="mt-2 font-serif text-4xl">Your appointments</h2></div>
              <Button to="/appointment" variant="outline" className="hidden sm:inline-flex">Book New</Button>
            </div>

            {bookings.length ? (
              <div className="mt-6 space-y-4">
                {bookings.map((booking) => {
                  const open = openBooking === booking.id;
                  const canManage = !['Cancelled', 'Completed'].includes(booking.status);
                  return (
                    <article key={booking.id} className="border border-black/10 bg-white/25">
                      <div className="p-5 sm:p-6">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="micro-meta">{booking.id}</p>
                            <h3 className="mt-2 font-serif text-2xl">{booking.product || booking.service || 'Tailoring Fitting'}</h3>
                            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
                              <span className="inline-flex items-center gap-1.5"><CalendarDays size={14}/>{readableDate(booking.date)}</span>
                              <span className="inline-flex items-center gap-1.5"><Clock3 size={14}/>{booking.time || 'Time pending'}</span>
                              <span className="inline-flex items-center gap-1.5"><MapPin size={14}/>{booking.location || 'At Studio'}</span>
                            </p>
                          </div>
                          <span className={`border px-3 py-1.5 text-[9px] uppercase tracking-[.14em] ${statusTone(booking.status)}`}>{booking.status || 'Pending'}</span>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2 border-t border-black/10 pt-4">
                          <button type="button" onClick={() => setOpenBooking(open ? '' : booking.id)} className="inline-flex min-h-10 items-center gap-2 border border-black/15 px-4 text-[9px] uppercase tracking-[.14em] hover:border-gold hover:text-gold">{open ? <ChevronUp size={14}/> : <ChevronDown size={14}/>} View Details</button>
                          {canManage && <Link to={`/appointment?edit=${encodeURIComponent(booking.id)}`} className="inline-flex min-h-10 items-center gap-2 border border-black/15 px-4 text-[9px] uppercase tracking-[.14em] hover:border-gold hover:text-gold"><Pencil size={13}/> Change / Reschedule</Link>}
                          {canManage && <button type="button" onClick={() => cancelBooking(booking)} className="inline-flex min-h-10 items-center gap-2 border border-red-900/15 px-4 text-[9px] uppercase tracking-[.14em] text-red-800 hover:border-red-800"><XCircle size={13}/> Cancel</button>}
                        </div>
                      </div>

                      {open && (
                        <div className="grid gap-4 border-t border-black/10 bg-cream/45 p-5 text-sm sm:grid-cols-2 sm:p-6">
                          <Detail label="Fabric" value={booking.fabric || 'Decide at fitting'}/>
                          <Detail label="Fit" value={booking.fit || '—'}/>
                          <Detail label="Style Direction" value={booking.styleDirection || '—'}/>
                          <Detail label="Personalisation" value={booking.personalization || '—'}/>
                          <Detail label="Occasion" value={booking.occasion || '—'}/>
                          <Detail label="Event Date" value={booking.eventDate ? readableDate(booking.eventDate) : '—'}/>
                          <Detail label="Preferred Contact" value={booking.contact || '—'}/>
                          <Detail label="Phone" value={booking.phone || '—'}/>
                          <div className="sm:col-span-2"><Detail label="Notes" value={booking.notes || 'No additional notes.'}/></div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            ) : (
              <EmptyState icon={CalendarDays} title="No fitting requests yet." copy="Start a tailoring request and it will appear here for review or rescheduling." action="Book a Fitting" to="/appointment"/>
            )}
          </section>

          <section>
            <div className="flex items-end justify-between gap-4 border-b border-black/15 pb-5">
              <div><p className="eyebrow">ORDERS</p><h2 className="mt-2 font-serif text-4xl">Your purchases</h2></div>
              <Button to="/readymade" variant="outline" className="hidden sm:inline-flex">Shop</Button>
            </div>

            {!session || session.role !== 'customer' ? (
              <div className="mt-6 border border-black/10 bg-white/25 p-7">
                <ShoppingBag className="text-gold" size={22}/>
                <h3 className="mt-4 font-serif text-2xl">Sign in to view orders.</h3>
                <p className="mt-3 text-sm leading-6 text-muted">Ready-made purchases are connected to your customer account.</p>
                <div className="mt-6 flex gap-3"><Button to="/login">Sign In</Button><Button to="/signup" variant="outline">Create Account</Button></div>
              </div>
            ) : orders.length ? (
              <div className="mt-6 space-y-4">
                {orders.map((order) => {
                  const open = openOrder === order.id;
                  const canEdit = order.status === 'Order Received';
                  const editing = editingOrder === order.id;
                  return (
                    <article key={order.id} className="border border-black/10 bg-white/25">
                      <div className="p-5 sm:p-6">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="micro-meta">{order.id}</p>
                            <h3 className="mt-2 font-serif text-2xl">{order.items?.length === 1 ? order.items[0].name : `${order.items?.length || 0} items`}</h3>
                            <p className="mt-2 text-xs text-muted">Placed {new Date(order.createdAt).toLocaleDateString('en-NP')} · Rs. {Number(order.total || order.amount || 0).toLocaleString()}</p>
                          </div>
                          <div className="text-right"><span className={`inline-block border px-3 py-1.5 text-[9px] uppercase tracking-[.14em] ${statusTone(order.status)}`}>{order.status || 'Order Received'}</span><p className="mt-2 text-[10px] text-muted">Payment: {order.payment || 'Pending'}</p></div>
                        </div>

                        {savedOrder === order.id && <p className="mt-4 border-l-2 border-gold pl-3 text-xs text-gold">Delivery details updated.</p>}

                        <div className="mt-5 flex flex-wrap gap-2 border-t border-black/10 pt-4">
                          <button type="button" onClick={() => setOpenOrder(open ? '' : order.id)} className="inline-flex min-h-10 items-center gap-2 border border-black/15 px-4 text-[9px] uppercase tracking-[.14em] hover:border-gold hover:text-gold">{open ? <ChevronUp size={14}/> : <ChevronDown size={14}/>} View Order</button>
                          {canEdit && !editing && <button type="button" onClick={() => beginOrderEdit(order)} className="inline-flex min-h-10 items-center gap-2 border border-black/15 px-4 text-[9px] uppercase tracking-[.14em] hover:border-gold hover:text-gold"><Pencil size={13}/> Change Delivery</button>}
                        </div>
                      </div>

                      {editing && (
                        <div className="border-t border-black/10 bg-cream/45 p-5 sm:p-6">
                          <p className="text-[9px] uppercase tracking-[.16em] text-gold">CHANGE DELIVERY DETAILS</p>
                          <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <label className="text-xs text-muted">Delivery<select className="mt-2" value={orderEdit.delivery} onChange={(e) => setOrderEdit({ ...orderEdit, delivery: e.target.value })}><option>Studio Pickup</option><option>Local Delivery</option></select></label>
                            {orderEdit.delivery === 'Local Delivery' && <label className="text-xs text-muted">Delivery address<input className="mt-2" value={orderEdit.address} onChange={(e) => setOrderEdit({ ...orderEdit, address: e.target.value })} placeholder="Your delivery address"/></label>}
                            <label className="text-xs text-muted sm:col-span-2">Order note<textarea rows="3" className="mt-2" value={orderEdit.customerNote} onChange={(e) => setOrderEdit({ ...orderEdit, customerNote: e.target.value })} placeholder="Optional delivery note"/></label>
                          </div>
                          {orderEdit.delivery === 'Local Delivery' && !orderEdit.address.trim() && <p className="mt-3 text-xs text-red-800">Enter an address before saving local delivery.</p>}
                          <div className="mt-5 flex gap-2"><Button onClick={() => saveOrderEdit(order)} disabled={orderEdit.delivery === 'Local Delivery' && !orderEdit.address.trim()}>Save Changes</Button><Button onClick={() => setEditingOrder('')} variant="outline">Cancel</Button></div>
                          <p className="mt-4 text-[11px] leading-5 text-muted">Delivery details can only be changed while the order is still at “Order Received”. Once processing starts, contact STITCH directly.</p>
                        </div>
                      )}

                      {open && (
                        <div className="border-t border-black/10 bg-cream/45 p-5 sm:p-6">
                          <p className="text-[9px] uppercase tracking-[.16em] text-gold">ITEMS</p>
                          <div className="mt-4 divide-y divide-black/10 border-y border-black/10">
                            {(order.items || []).map((item, index) => (
                              <div key={`${item.id || item.name}-${index}`} className="flex items-start justify-between gap-5 py-4 text-sm">
                                <div><p className="font-medium">{item.name}</p><p className="mt-1 text-xs text-muted">{item.size ? `Size ${item.size} · ` : ''}Qty {item.quantity}</p></div>
                                <p>Rs. {(Number(item.price || 0) * Number(item.quantity || 1)).toLocaleString()}</p>
                              </div>
                            ))}
                          </div>
                          <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                            <Detail label="Delivery" value={order.delivery || 'Studio Pickup'}/>
                            <Detail label="Address" value={order.address || 'Studio pickup'}/>
                            <Detail label="Payment Method" value={order.paymentMethod || 'Pay on Pickup / Delivery'}/>
                            <Detail label="Phone" value={order.phone || '—'}/>
                            <div className="sm:col-span-2"><Detail label="Order Note" value={order.customerNote || 'No additional note.'}/></div>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            ) : (
              <EmptyState icon={PackageCheck} title="No ready-made orders yet." copy="Orders placed through checkout will appear here with their current status." action="Shop Ready-Made" to="/readymade"/>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}

function Detail({ label, value }) {
  return <div><p className="text-[9px] uppercase tracking-[.14em] text-muted">{label}</p><p className="mt-1.5 leading-6 text-ink">{value}</p></div>;
}

function EmptyState({ icon: Icon, title, copy, action, to }) {
  return <div className="mt-6 border border-dashed border-black/15 p-8 text-center"><Icon className="mx-auto text-gold" size={24}/><h3 className="mt-4 font-serif text-2xl">{title}</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{copy}</p><Button to={to} className="mt-6">{action}</Button></div>;
}
