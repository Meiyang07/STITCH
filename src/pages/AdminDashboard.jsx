import {
  AlertTriangle,
  BarChart3,
  Bell,
  Boxes,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Download,
  FileText,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  Minus,
  PackagePlus,
  PackageSearch,
  Plus,
  Scissors,
  Search,
  ShoppingBag,
  Store,
  Truck,
  Users,
  WalletCards,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DonutChart, HorizontalBars, RevenueLineChart, Sparkline, VerticalBarChart } from '../components/admin/AdminCharts';
import siteConfig from '../config/siteConfig';
import {
  addCustomerOrder,
  addInventoryItem,
  addSupplier,
  createPurchaseOrder,
  deleteSupplier,
  exportOrdersCsv,
  exportPurchaseOrdersCsv,
  getAdminAppointments,
  getAdminCustomers,
  getAdminInventory,
  getAdminOrders,
  getPurchaseOrders,
  getSuppliers,
  receivePurchaseOrder,
  updateAppointmentStatus,
  updateInventoryItem,
  updateOrderPayment,
  updateOrderStatus,
  updatePurchaseOrderPayment,
  updatePurchaseOrderStatus,
} from '../utils/adminStorage';
import { getSession, logoutUser } from '../utils/authStorage';

const navItems = [
  ['overview', 'Overview', LayoutDashboard],
  ['orders', 'Customer Orders', ShoppingBag],
  ['appointments', 'Appointments', CalendarDays],
  ['customers', 'Customers', Users],
  ['inventory', 'Inventory', Boxes],
  ['procurement', 'Procurement', Truck],
  ['suppliers', 'Suppliers', Store],
];

const orderStatuses = ['Order Received', 'Packed', 'In Fitting', 'In Production', 'Ready', 'Completed', 'Cancelled'];
const paymentStatuses = ['Pending', 'Advance Paid', 'Paid', 'Refunded'];
const appointmentStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
const poStatuses = ['Draft', 'Sent', 'Confirmed', 'Partially Received', 'Received', 'Cancelled'];
const poPayments = ['Unpaid', 'Advance Paid', 'Paid'];
const ranges = [
  { value: 30, label: 'Last 30 days' },
  { value: 90, label: 'Last 90 days' },
  { value: 365, label: 'Last 12 months' },
];
const rawMaterialGroups = ['Fabric', 'Lining', 'Canvas', 'Buttons', 'Thread', 'Zippers', 'Trims', 'Accessories', 'Packaging', 'Other'];
const inventoryGroups = ['Made-to-Order', 'Ready-Made', ...rawMaterialGroups];
const units = ['m', 'yd', 'pcs', 'pairs', 'rolls', 'sets', 'kg', 'boxes'];

const money = (value) => `Rs. ${Math.round(Number(value) || 0).toLocaleString('en-NP')}`;
const shortDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-NP', { day: 'numeric', month: 'short', year: 'numeric' });
};

function withinDays(value, days) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return date >= new Date(Date.now() - days * 86400000);
}

function timelineFor(orders, days) {
  const now = new Date();
  const buckets = [];
  if (days <= 30) {
    for (let index = 5; index >= 0; index -= 1) {
      const end = new Date(now);
      end.setDate(now.getDate() - index * 5);
      end.setHours(23, 59, 59, 999);
      const start = new Date(end);
      start.setDate(end.getDate() - 4);
      start.setHours(0, 0, 0, 0);
      buckets.push({ start, end, label: end.toLocaleDateString('en-NP', { day: 'numeric', month: 'short' }) });
    }
  } else if (days <= 90) {
    for (let index = 5; index >= 0; index -= 1) {
      const end = new Date(now);
      end.setDate(now.getDate() - index * 15);
      end.setHours(23, 59, 59, 999);
      const start = new Date(end);
      start.setDate(end.getDate() - 14);
      start.setHours(0, 0, 0, 0);
      buckets.push({ start, end, label: end.toLocaleDateString('en-NP', { day: 'numeric', month: 'short' }) });
    }
  } else {
    for (let index = 5; index >= 0; index -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
      buckets.push({
        start: new Date(date.getFullYear(), date.getMonth(), 1),
        end: new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59),
        label: date.toLocaleDateString('en-NP', { month: 'short' }),
      });
    }
  }

  return buckets.map((bucket) => {
    const inBucket = orders.filter((order) => {
      const created = new Date(order.createdAt);
      return created >= bucket.start && created <= bucket.end && order.status !== 'Cancelled';
    });
    return {
      label: bucket.label,
      revenue: inBucket.reduce((sum, order) => sum + Number(order.paidAmount || 0), 0),
      orders: inBucket.length,
    };
  });
}

function groupCount(items, key) {
  const counts = new Map();
  items.forEach((item) => {
    const label = item[key] || 'Other';
    counts.set(label, (counts.get(label) || 0) + 1);
  });
  return [...counts.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}

function groupSum(items, labelGetter, valueGetter) {
  const totals = new Map();
  items.forEach((item) => {
    const label = labelGetter(item) || 'Other';
    totals.set(label, (totals.get(label) || 0) + Number(valueGetter(item) || 0));
  });
  return [...totals.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}

function StatCard({ label, value, meta, icon: Icon, values = [], tone = 'default' }) {
  return (
    <div className="group border border-black/10 bg-[#FAF8F3] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-[0_18px_50px_rgba(20,18,14,.07)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[9px] uppercase tracking-[.2em] text-muted">{label}</p>
          <p className="mt-3 font-serif text-3xl leading-none sm:text-4xl">{value}</p>
        </div>
        <span className={`flex h-10 w-10 items-center justify-center border ${tone === 'alert' ? 'border-red-900/15 text-red-800' : 'border-black/10 text-gold'}`}><Icon size={17} strokeWidth={1.6} /></span>
      </div>
      <div className="mt-5 flex min-h-10 items-end justify-between gap-4 border-t border-black/10 pt-4">
        <p className="max-w-[170px] text-[10px] leading-4 text-muted">{meta}</p>
        <Sparkline values={values} positive={tone !== 'alert'} />
      </div>
    </div>
  );
}

function Panel({ title, eyebrow, action, children, className = '' }) {
  return (
    <section className={`border border-black/10 bg-[#FAF8F3] shadow-[0_12px_40px_rgba(20,18,14,.035)] ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/10 px-5 py-5 sm:px-6">
        <div>
          {eyebrow && <p className="text-[9px] uppercase tracking-[.2em] text-gold">{eyebrow}</p>}
          <h2 className="mt-1 font-serif text-2xl sm:text-3xl">{title}</h2>
        </div>
        {action}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function EmptyState({ title, copy, action }) {
  return (
    <div className="flex min-h-52 items-center justify-center border border-dashed border-black/15 bg-white/20 px-6 py-10 text-center">
      <div className="max-w-md">
        <p className="font-serif text-3xl">{title}</p>
        <p className="mt-3 text-xs leading-6 text-muted">{copy}</p>
        {action && <div className="mt-6">{action}</div>}
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const styles = {
    Completed: 'bg-emerald-950/8 text-emerald-900',
    Confirmed: 'bg-emerald-950/8 text-emerald-900',
    Received: 'bg-emerald-950/8 text-emerald-900',
    Paid: 'bg-emerald-950/8 text-emerald-900',
    Ready: 'bg-gold/10 text-[#755728]',
    'Order Received': 'bg-blue-950/8 text-blue-900',
    Packed: 'bg-purple-950/8 text-purple-900',
    Sent: 'bg-blue-950/8 text-blue-900',
    'In Fitting': 'bg-blue-950/8 text-blue-900',
    'In Production': 'bg-slate-950/8 text-slate-800',
    Draft: 'bg-black/5 text-muted',
    Pending: 'bg-amber-950/8 text-amber-900',
    Unpaid: 'bg-amber-950/8 text-amber-900',
    'Advance Paid': 'bg-gold/10 text-[#755728]',
    'Partially Received': 'bg-purple-950/8 text-purple-900',
    Cancelled: 'bg-red-950/8 text-red-900',
    Refunded: 'bg-red-950/8 text-red-900',
  };
  return <span className={`inline-flex px-2.5 py-1 text-[9px] uppercase tracking-[.12em] ${styles[status] || 'bg-black/5 text-muted'}`}>{status}</span>;
}

function ModalShell({ open, onClose, eyebrow, title, children, maxWidth = 'max-w-2xl' }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[160] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm" onMouseDown={onClose}>
          <motion.div initial={{ opacity: 0, y: 18, scale: .99 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10 }} onMouseDown={(event) => event.stopPropagation()} className={`max-h-[92vh] w-full overflow-y-auto bg-cream p-6 shadow-2xl sm:p-8 ${maxWidth}`}>
            <div className="flex items-start justify-between gap-6">
              <div><p className="eyebrow">{eyebrow}</p><h2 className="mt-2 font-serif text-4xl">{title}</h2></div>
              <button onClick={onClose} aria-label="Close"><X size={20} /></button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CustomerOrderModal({ open, onClose, onSave }) {
  const blank = { customer: '', item: '', category: 'Bespoke', amount: '', paidAmount: '', status: 'In Production', payment: 'Pending', dueDate: '', notes: '' };
  const [form, setForm] = useState(blank);
  const submit = (event) => {
    event.preventDefault();
    if (!form.customer.trim() || !form.item.trim() || Number(form.amount) <= 0) return;
    onSave(form);
    setForm(blank);
    onClose();
  };

  return (
    <ModalShell open={open} onClose={onClose} eyebrow="CUSTOMER WORK" title="Record customer order">
      <form onSubmit={submit} className="mt-8 grid gap-4 sm:grid-cols-2">
        <label className="text-xs text-muted sm:col-span-2">Customer<input className="mt-2" value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} placeholder="Customer name" required /></label>
        <label className="text-xs text-muted sm:col-span-2">Garment / item<input className="mt-2" value={form.item} onChange={(e) => setForm({ ...form, item: e.target.value })} placeholder="Bespoke suit, wedding suit…" required /></label>
        <label className="text-xs text-muted">Category<select className="mt-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option>Bespoke</option><option>Wedding</option><option>Women</option><option>Traditional</option><option>Formal</option><option>Shirts</option><option>Accessories</option><option>Ready-Made</option><option>Trousers</option></select></label>
        <label className="text-xs text-muted">Due date<input className="mt-2" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></label>
        <label className="text-xs text-muted">Order value (Rs.)<input className="mt-2" type="number" min="1" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required /></label>
        <label className="text-xs text-muted">Paid amount (Rs.)<input className="mt-2" type="number" min="0" max={form.amount || undefined} value={form.paidAmount} onChange={(e) => setForm({ ...form, paidAmount: e.target.value })} /></label>
        <label className="text-xs text-muted">Status<select className="mt-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{orderStatuses.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="text-xs text-muted">Payment<select className="mt-2" value={form.payment} onChange={(e) => setForm({ ...form, payment: e.target.value })}>{paymentStatuses.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="text-xs text-muted sm:col-span-2">Notes<textarea rows="3" className="mt-2" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Measurements, fitting notes, special instructions…" /></label>
        <button className="mt-3 bg-ink px-5 py-4 text-[10px] uppercase tracking-[.2em] text-white transition-colors hover:bg-gold sm:col-span-2">Save customer order</button>
      </form>
    </ModalShell>
  );
}

function SupplierModal({ open, onClose, onSave }) {
  const blank = { businessName: '', supplierType: 'Raw Material', contactPerson: '', phone: '', whatsapp: '', email: '', address: '', panVat: '', notes: '' };
  const [form, setForm] = useState(blank);
  const submit = (event) => {
    event.preventDefault();
    if (!form.businessName.trim()) return;
    onSave(form);
    setForm(blank);
    onClose();
  };
  return (
    <ModalShell open={open} onClose={onClose} eyebrow="SUPPLIER DIRECTORY" title="Add supplier">
      <form onSubmit={submit} className="mt-8 grid gap-4 sm:grid-cols-2">
        <label className="text-xs text-muted sm:col-span-2">Business / supplier name<input className="mt-2" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} required /></label>
        <label className="text-xs text-muted">Supplier type<select className="mt-2" value={form.supplierType} onChange={(e) => setForm({ ...form, supplierType: e.target.value })}><option>Raw Material</option><option>Ready-Made</option><option>Production</option></select></label>
        <label className="text-xs text-muted">Contact person<input className="mt-2" value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} /></label>
        <label className="text-xs text-muted">PAN / VAT<input className="mt-2" value={form.panVat} onChange={(e) => setForm({ ...form, panVat: e.target.value })} /></label>
        <label className="text-xs text-muted">Phone<input className="mt-2" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+977…" /></label>
        <label className="text-xs text-muted">WhatsApp<input className="mt-2" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="+977…" /></label>
        <label className="text-xs text-muted sm:col-span-2">Email<input className="mt-2" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label className="text-xs text-muted sm:col-span-2">Address<input className="mt-2" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Pokhara, Kathmandu, India…" /></label>
        <label className="text-xs text-muted sm:col-span-2">Notes<textarea rows="3" className="mt-2" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Lead time, minimum order, preferred payment terms…" /></label>
        <button className="mt-3 bg-ink px-5 py-4 text-[10px] uppercase tracking-[.2em] text-white hover:bg-gold sm:col-span-2">Save supplier</button>
      </form>
    </ModalShell>
  );
}

function StockControl({ item, onCommit }) {
  const [draft, setDraft] = useState(String(item.stock ?? 0));

  useEffect(() => {
    setDraft(String(item.stock ?? 0));
  }, [item.stock]);

  const normalized = () => {
    if (draft.trim() === '') return 0;
    return Math.max(0, Number(draft) || 0);
  };

  const commit = (value = normalized()) => {
    const next = Math.max(0, Number(value) || 0);
    setDraft(String(next));
    onCommit(next);
  };

  const changeBy = (amount) => {
    const current = draft.trim() === '' ? Number(item.stock || 0) : Number(draft || 0);
    commit(Math.max(0, current + amount));
  };

  return (
    <div className="flex min-w-[210px] items-center gap-2">
      <button type="button" onClick={() => changeBy(-1)} className="flex h-9 w-9 shrink-0 items-center justify-center border border-black/10 text-muted transition-colors hover:border-gold hover:text-gold" aria-label={`Decrease ${item.item} stock by 1`}><Minus size={13}/></button>
      <input
        type="number"
        min="0"
        step="1"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onFocus={(event) => event.currentTarget.select()}
        onBlur={() => commit()}
        onKeyDown={(event) => { if (event.key === 'Enter') event.currentTarget.blur(); }}
        className="w-20 py-2 text-center"
        aria-label={`${item.item} stock quantity`}
      />
      <button type="button" onClick={() => changeBy(1)} className="flex h-9 w-9 shrink-0 items-center justify-center border border-black/10 text-muted transition-colors hover:border-gold hover:text-gold" aria-label={`Increase ${item.item} stock by 1`}><Plus size={13}/></button>
      <span className="whitespace-nowrap text-muted">{item.unit}</span>
    </div>
  );
}

function InventoryModal({ open, onClose, onSave, suppliers, onNeedSupplier }) {
  const blank = { item: '', group: 'Fabric', stock: '', unit: 'm', reorderAt: '', unitCost: '', supplierId: '' };
  const [form, setForm] = useState(blank);
  const materialSuggestions = {
    Fabric: ['Suiting fabric', 'Shirting fabric', 'Lining fabric', 'Pocketing fabric'],
    Canvas: ['Horsehair canvas', 'Fusible canvas', 'Chest canvas'],
    Buttons: ['Suit buttons', 'Shirt buttons', 'Blazer buttons'],
    Thread: ['Tailoring thread', 'Buttonhole thread'],
    Trims: ['Shoulder pads', 'Sleeve heads', 'Zippers', 'Labels'],
    Accessories: ['Pocket squares', 'Ties', 'Cufflinks'],
    Packaging: ['Garment bags', 'Hangers', 'Packaging boxes'],
    Other: ['Other material'],
  };
  const submit = (event) => {
    event.preventDefault();
    if (!form.item.trim()) return;
    onSave(form);
    setForm(blank);
    onClose();
  };
  return (
    <ModalShell open={open} onClose={onClose} eyebrow="STOCK CONTROL" title="Add inventory item">
      <form onSubmit={submit} className="mt-8 grid gap-4 sm:grid-cols-2">
        <label className="text-xs text-muted sm:col-span-2">Item name<input className="mt-2" value={form.item} onChange={(e) => setForm({ ...form, item: e.target.value })} placeholder="Italian wool — navy" required /></label>
        <div className="sm:col-span-2">
          <p className="text-[9px] uppercase tracking-[.14em] text-muted">Quick material names</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(materialSuggestions[form.group] || []).map((name) => <button key={name} type="button" onClick={() => setForm({ ...form, item: name })} className="border border-black/10 px-3 py-2 text-[9px] text-muted transition-colors hover:border-gold hover:text-gold">{name}</button>)}
          </div>
        </div>
        <label className="text-xs text-muted">Group<select className="mt-2" value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })}>{inventoryGroups.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="text-xs text-muted">Unit<select className="mt-2" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>{units.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="text-xs text-muted">Opening stock<input className="mt-2" type="number" min="0" step="0.01" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></label>
        <label className="text-xs text-muted">Reorder point<input className="mt-2" type="number" min="0" step="0.01" value={form.reorderAt} onChange={(e) => setForm({ ...form, reorderAt: e.target.value })} /></label>
        <label className="text-xs text-muted">Unit cost (Rs.)<input className="mt-2" type="number" min="0" step="0.01" value={form.unitCost} onChange={(e) => setForm({ ...form, unitCost: e.target.value })} /></label>
        <label className="text-xs text-muted">Preferred supplier<select className="mt-2" value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })}><option value="">None</option>{suppliers.map((supplier) => <option value={supplier.id} key={supplier.id}>{supplier.businessName}</option>)}</select></label>
        <div className="flex items-end">
          <button type="button" onClick={() => { onClose(); onNeedSupplier(); }} className="w-full border border-black/10 px-4 py-3 text-[9px] uppercase tracking-[.14em] text-muted transition-colors hover:border-gold hover:text-gold">{suppliers.length ? 'Add another supplier' : 'Add supplier first'}</button>
        </div>
        <button className="mt-3 bg-ink px-5 py-4 text-[10px] uppercase tracking-[.2em] text-white hover:bg-gold sm:col-span-2">Add to inventory</button>
      </form>
    </ModalShell>
  );
}

function PurchaseOrderModal({ open, onClose, onSave, suppliers, onNeedSupplier }) {
  const blankLine = () => ({ name: '', group: 'Fabric', quantity: '', unit: 'm', unitCost: '' });
  const blank = { supplierId: '', items: [blankLine()], shipping: '', discount: '', taxPercent: '', expectedDate: '', paymentStatus: 'Unpaid', status: 'Draft', notes: '' };
  const [form, setForm] = useState(blank);
  const rawMaterialSuppliers = suppliers.filter((supplier) => !supplier.supplierType || supplier.supplierType === 'Raw Material');

  const updateLine = (index, key, value) => setForm((current) => ({ ...current, items: current.items.map((line, i) => i === index ? { ...line, [key]: value } : line) }));
  const addLine = () => setForm((current) => ({ ...current, items: [...current.items, blankLine()] }));
  const removeLine = (index) => setForm((current) => ({ ...current, items: current.items.filter((_, i) => i !== index) }));
  const subtotal = form.items.reduce((sum, line) => sum + (Number(line.quantity) || 0) * (Number(line.unitCost) || 0), 0);
  const taxable = Math.max(0, subtotal + (Number(form.shipping) || 0) - (Number(form.discount) || 0));
  const total = taxable + taxable * ((Number(form.taxPercent) || 0) / 100);

  const saveOrder = (contactMethod = null) => {
    const validItems = form.items.filter((line) => line.name.trim() && Number(line.quantity) > 0);
    if (!form.supplierId) return window.alert('Select a supplier first.');
    if (!validItems.length) return window.alert('Add at least one material with a quantity greater than zero.');

    const supplier = suppliers.find((item) => item.id === form.supplierId);
    if (contactMethod === 'whatsapp' && !String(supplier?.whatsapp || '').replace(/\D/g, '')) {
      return window.alert('Add a WhatsApp number to this supplier first.');
    }
    if (contactMethod === 'email' && !supplier?.email) {
      return window.alert('Add an email address to this supplier first.');
    }

    const createdOrder = onSave({ ...form, items: validItems, status: contactMethod ? 'Sent' : form.status });
    if (!createdOrder) return;

    if (contactMethod === 'whatsapp') openWhatsApp(createdOrder, supplier);
    if (contactMethod === 'email') openEmail(createdOrder, supplier);

    setForm(blank);
    onClose();
  };

  return (
    <ModalShell open={open} onClose={onClose} eyebrow="RAW MATERIAL PROCUREMENT" title="New purchase order" maxWidth="max-w-4xl">
      {!rawMaterialSuppliers.length ? (
        <div className="mt-8">
          <EmptyState title="Add a supplier first" copy="A raw-material purchase order needs a supplier. Add the business you buy fabric, lining, buttons, thread, trims or packaging from, then return here." action={<button onClick={() => { onClose(); onNeedSupplier(); }} className="bg-ink px-5 py-3 text-[10px] uppercase tracking-[.16em] text-white">Add supplier</button>} />
        </div>
      ) : (
        <form onSubmit={(event) => event.preventDefault()} className="mt-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="text-xs text-muted sm:col-span-2">Supplier<select className="mt-2" value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })} required><option value="">Select supplier</option>{rawMaterialSuppliers.map((supplier) => <option value={supplier.id} key={supplier.id}>{supplier.businessName}</option>)}</select></label>
            <label className="text-xs text-muted">Expected delivery<input className="mt-2" type="date" value={form.expectedDate} onChange={(e) => setForm({ ...form, expectedDate: e.target.value })} /></label>
          </div>

          <div className="mt-8 border-t border-black/10 pt-6">
            <div className="flex items-center justify-between gap-4"><div><p className="eyebrow">RAW MATERIALS</p><h3 className="mt-1 font-serif text-2xl">Order lines</h3></div><button type="button" onClick={addLine} className="flex items-center gap-2 text-[9px] uppercase tracking-[.15em] text-gold"><Plus size={13}/> Add line</button></div>
            <div className="mt-5 space-y-3">
              {form.items.map((line, index) => (
                <div key={index} className="grid gap-3 border border-black/10 bg-white/25 p-4 lg:grid-cols-[1.5fr_.8fr_.65fr_.65fr_.8fr_auto]">
                  <label className="text-[10px] text-muted">Material<input className="mt-1.5" value={line.name} onChange={(e) => updateLine(index, 'name', e.target.value)} placeholder="Wool, lining, buttons…" /></label>
                  <label className="text-[10px] text-muted">Group<select className="mt-1.5" value={line.group} onChange={(e) => updateLine(index, 'group', e.target.value)}>{rawMaterialGroups.map((item) => <option key={item}>{item}</option>)}</select></label>
                  <label className="text-[10px] text-muted">Qty<input className="mt-1.5" type="number" min="0" step="0.01" value={line.quantity} onChange={(e) => updateLine(index, 'quantity', e.target.value)} /></label>
                  <label className="text-[10px] text-muted">Unit<select className="mt-1.5" value={line.unit} onChange={(e) => updateLine(index, 'unit', e.target.value)}>{units.map((item) => <option key={item}>{item}</option>)}</select></label>
                  <label className="text-[10px] text-muted">Unit cost<input className="mt-1.5" type="number" min="0" step="0.01" value={line.unitCost} onChange={(e) => updateLine(index, 'unitCost', e.target.value)} /></label>
                  <button type="button" onClick={() => removeLine(index)} disabled={form.items.length === 1} className="mt-5 h-10 w-10 text-muted hover:text-red-800 disabled:opacity-20" aria-label="Remove line"><X size={15}/></button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-xs text-muted">Shipping (Rs.)<input className="mt-2" type="number" min="0" value={form.shipping} onChange={(e) => setForm({ ...form, shipping: e.target.value })} /></label>
            <label className="text-xs text-muted">Discount (Rs.)<input className="mt-2" type="number" min="0" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} /></label>
            <label className="text-xs text-muted">Tax % (if applicable)<input className="mt-2" type="number" min="0" step="0.01" value={form.taxPercent} onChange={(e) => setForm({ ...form, taxPercent: e.target.value })} /></label>
            <label className="text-xs text-muted">Payment<select className="mt-2" value={form.paymentStatus} onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })}>{poPayments.map((item) => <option key={item}>{item}</option>)}</select></label>
          </div>
          <label className="mt-4 block text-xs text-muted">Supplier / material notes<textarea rows="3" className="mt-2" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Quality, colour, GSM, delivery instructions, MOQ reference…" /></label>

          <div className="mt-6 flex flex-col items-end gap-1 border-y border-black/10 py-5 text-sm">
            <p className="text-muted">Subtotal <span className="ml-8 text-ink">{money(subtotal)}</span></p>
            <p className="text-muted">Estimated total <strong className="ml-8 font-serif text-2xl font-medium text-ink">{money(total)}</strong></p>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-lg text-[10px] leading-5 text-muted">This PO is for STITCH to buy raw materials from the selected supplier. Creating it records the purchase; Email or WhatsApp sends the material order to that supplier.</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => saveOrder('email')} className="flex items-center gap-2 border border-black/15 px-5 py-4 text-[10px] uppercase tracking-[.18em] text-ink transition-colors hover:border-gold hover:text-gold"><Mail size={14}/> Create &amp; Email</button>
              <button type="button" onClick={() => saveOrder('whatsapp')} className="flex items-center gap-2 bg-ink px-5 py-4 text-[10px] uppercase tracking-[.18em] text-white transition-colors hover:bg-gold"><MessageCircle size={14}/> Create &amp; WhatsApp</button>
            </div>
          </div>
        </form>
      )}
    </ModalShell>
  );
}

function supplierName(id, suppliers) {
  return suppliers.find((supplier) => supplier.id === id)?.businessName || 'Unknown supplier';
}

function purchaseOrderMessage(order, supplier) {
  const lines = order.items.map((item) => `• ${item.name} — ${item.quantity} ${item.unit} × ${money(item.unitCost)}`).join('\n');
  return `STITCH Purchase Order ${order.id}\nSupplier: ${supplier?.businessName || ''}\n\nRaw materials required:\n${lines}\n\nEstimated total: ${money(order.total)}${order.expectedDate ? `\nExpected delivery: ${order.expectedDate}` : ''}${order.notes ? `\nNotes: ${order.notes}` : ''}\n\nPlease confirm material availability, final unit prices, quantities and delivery date.`;
}

function openWhatsApp(order, supplier) {
  const phone = String(supplier?.whatsapp || '').replace(/\D/g, '');
  if (!phone) return window.alert('No verified WhatsApp number is saved for this supplier. Add one in the supplier record first.');
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(purchaseOrderMessage(order, supplier))}`, '_blank', 'noopener,noreferrer');
}

function openEmail(order, supplier) {
  if (!supplier?.email) return window.alert('Add an email address to this supplier first.');
  const subject = `STITCH Purchase Order ${order.id}`;
  window.location.href = `mailto:${supplier.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(purchaseOrderMessage(order, supplier))}`;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const session = getSession();
  const [active, setActive] = useState('overview');
  const [range, setRange] = useState(90);
  const [mobileNav, setMobileNav] = useState(false);
  const [query, setQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [customerOrderOpen, setCustomerOrderOpen] = useState(false);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [supplierOpen, setSupplierOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [readNotificationIds, setReadNotificationIds] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('stitch_admin_notifications_read_v1') || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });
  const [revision, setRevision] = useState(0);

  const data = useMemo(() => ({
    orders: getAdminOrders(),
    customers: getAdminCustomers(),
    appointments: getAdminAppointments(),
    inventory: getAdminInventory(),
    suppliers: getSuppliers(),
    purchaseOrders: getPurchaseOrders(),
  }), [revision]);

  useEffect(() => {
    document.title = 'Admin Dashboard | Stitch';
    const onStorage = () => setRevision((value) => value + 1);
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const filteredOrders = useMemo(() => data.orders.filter((order) => withinDays(order.createdAt, range)), [data.orders, range]);
  const filteredPOs = useMemo(() => data.purchaseOrders.filter((order) => withinDays(order.createdAt, range)), [data.purchaseOrders, range]);
  const recentAppointments = useMemo(() => data.appointments.filter((item) => withinDays(item.createdAt || item.date, range)), [data.appointments, range]);
  const activeOrders = data.orders.filter((order) => !['Completed', 'Cancelled'].includes(order.status)).length;
  const cashCollected = filteredOrders.filter((order) => order.status !== 'Cancelled').reduce((sum, order) => sum + Number(order.paidAmount || 0), 0);
  const orderBookValue = filteredOrders.filter((order) => order.status !== 'Cancelled').reduce((sum, order) => sum + Number(order.amount || 0), 0);
  const outstanding = Math.max(0, orderBookValue - cashCollected);
  const procurementSpend = filteredPOs.filter((order) => order.status !== 'Cancelled').reduce((sum, order) => sum + Number(order.total || 0), 0);
  const inventoryValue = data.inventory.reduce((sum, item) => sum + Number(item.stock || 0) * Number(item.unitCost || 0), 0);
  const lowStock = data.inventory.filter((item) => Number(item.stock) <= Number(item.reorderAt) && Number(item.reorderAt) > 0);
  const timeline = timelineFor(filteredOrders, range);
  const statusSegments = groupCount(filteredOrders, 'status');
  const serviceDemand = groupCount(recentAppointments, 'service').slice(0, 6);
  const categoryOrderValue = groupSum(filteredOrders.filter((order) => order.status !== 'Cancelled'), (order) => order.category, (order) => order.amount).slice(0, 7);
  const supplierSpend = groupSum(filteredPOs.filter((po) => po.status !== 'Cancelled'), (po) => supplierName(po.supplierId, data.suppliers), (po) => po.total).slice(0, 6);
  const pendingAppointments = data.appointments.filter((item) => (item.status || 'Pending') === 'Pending').length;
  const openPOs = data.purchaseOrders.filter((po) => !['Received', 'Cancelled'].includes(po.status)).length;

  const notifications = useMemo(() => {
    const alerts = [];
    const now = Date.now();
    const day = 86400000;

    data.appointments
      .filter((item) => (item.status || 'Pending') === 'Pending')
      .forEach((item) => {
        const revised = Boolean(item.updatedAt && item.createdAt && item.updatedAt !== item.createdAt);
        alerts.push({
          id: `appointment-${item.id || item.createdAt}-${item.updatedAt || item.createdAt || ''}`,
          type: 'appointment',
          title: revised ? 'Fitting request updated' : 'New appointment request',
          message: `${item.name || 'Customer'} ${revised ? 'updated' : 'requested'} ${item.service || 'an appointment'}${item.date ? ` for ${shortDate(item.date)}` : ''}${item.time ? ` at ${item.time}` : ''}.`,
          createdAt: item.updatedAt || item.createdAt || item.date || new Date().toISOString(),
          view: 'appointments',
        });
      });

    data.orders.forEach((order) => {
      if (order.status === 'Order Received') {
        alerts.push({
          id: `order-${order.id}`,
          type: 'order',
          title: 'Customer order received',
          message: `${order.id} · ${order.customer} · ${order.item}`,
          createdAt: order.createdAt,
          view: 'orders',
        });
      }

      if (order.dueDate && !['Completed', 'Cancelled'].includes(order.status)) {
        const due = new Date(String(order.dueDate).includes('T') ? order.dueDate : `${order.dueDate}T23:59:59`);
        if (!Number.isNaN(due.getTime())) {
          const daysLeft = Math.ceil((due.getTime() - now) / day);
          if (daysLeft < 0) {
            alerts.push({
              id: `order-overdue-${order.id}-${order.dueDate}`,
              type: 'warning',
              title: 'Order overdue',
              message: `${order.id} for ${order.customer} was due ${shortDate(order.dueDate)}.`,
              createdAt: order.dueDate,
              view: 'orders',
            });
          } else if (daysLeft <= 2) {
            alerts.push({
              id: `order-due-${order.id}-${order.dueDate}`,
              type: 'warning',
              title: 'Order due soon',
              message: `${order.id} for ${order.customer} is due ${daysLeft === 0 ? 'today' : daysLeft === 1 ? 'tomorrow' : `in ${daysLeft} days`}.`,
              createdAt: order.updatedAt || order.createdAt,
              view: 'orders',
            });
          }
        }
      }
    });

    data.inventory
      .filter((item) => Number(item.reorderAt) > 0 && Number(item.stock) <= Number(item.reorderAt))
      .forEach((item) => alerts.push({
        id: `low-stock-${item.id}-${item.updatedAt || ''}`,
        type: 'stock',
        title: 'Low stock',
        message: `${item.item}: ${item.stock} ${item.unit} remaining (reorder at ${item.reorderAt}).`,
        createdAt: item.updatedAt || new Date().toISOString(),
        view: 'inventory',
      }));

    data.purchaseOrders
      .filter((po) => !['Received', 'Cancelled'].includes(po.status) && po.expectedDate)
      .forEach((po) => {
        const expected = new Date(String(po.expectedDate).includes('T') ? po.expectedDate : `${po.expectedDate}T23:59:59`);
        if (!Number.isNaN(expected.getTime()) && expected.getTime() < now) {
          alerts.push({
            id: `po-overdue-${po.id}-${po.expectedDate}`,
            type: 'po',
            title: 'Purchase order delivery overdue',
            message: `${po.id} from ${supplierName(po.supplierId, data.suppliers)} was expected ${shortDate(po.expectedDate)}.`,
            createdAt: po.expectedDate,
            view: 'procurement',
          });
        }
      });

    return alerts
      .filter((alert, index, all) => all.findIndex((item) => item.id === alert.id) === index)
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 30);
  }, [data.appointments, data.orders, data.inventory, data.purchaseOrders, data.suppliers]);

  const unreadNotifications = notifications.filter((item) => !readNotificationIds.includes(item.id));
  const unreadCount = unreadNotifications.length;

  const persistReadNotifications = (ids) => {
    const next = Array.from(new Set(ids)).slice(-200);
    setReadNotificationIds(next);
    localStorage.setItem('stitch_admin_notifications_read_v1', JSON.stringify(next));
  };

  const openNotification = (notification) => {
    if (!readNotificationIds.includes(notification.id)) persistReadNotifications([...readNotificationIds, notification.id]);
    setNotificationOpen(false);
    switchView(notification.view);
  };

  const markAllNotificationsRead = () => persistReadNotifications([...readNotificationIds, ...notifications.map((item) => item.id)]);

  const visibleOrders = useMemo(() => data.orders.filter((order) => {
    const text = `${order.id} ${order.customer} ${order.item} ${order.category}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (orderStatusFilter === 'All' || order.status === orderStatusFilter);
  }), [data.orders, query, orderStatusFilter]);
  const visibleCustomers = useMemo(() => data.customers.filter((customer) => `${customer.name} ${customer.email} ${customer.phone}`.toLowerCase().includes(query.toLowerCase())), [data.customers, query]);
  const visibleAppointments = useMemo(() => data.appointments.filter((appointment) => `${appointment.name} ${appointment.service} ${appointment.product || ''} ${appointment.fabric || ''} ${appointment.date}`.toLowerCase().includes(query.toLowerCase())), [data.appointments, query]);
  const visibleInventory = useMemo(() => data.inventory.filter((item) => {
    const supplier = supplierName(item.supplierId, data.suppliers);
    return `${item.item} ${item.group} ${supplier}`.toLowerCase().includes(query.toLowerCase());
  }), [data.inventory, data.suppliers, query]);
  const visiblePOs = useMemo(() => data.purchaseOrders.filter((po) => `${po.id} ${supplierName(po.supplierId, data.suppliers)} ${po.items.map((item) => item.name).join(' ')}`.toLowerCase().includes(query.toLowerCase())), [data.purchaseOrders, data.suppliers, query]);
  const visibleSuppliers = useMemo(() => data.suppliers.filter((supplier) => `${supplier.businessName} ${supplier.contactPerson} ${supplier.email} ${supplier.phone} ${supplier.address}`.toLowerCase().includes(query.toLowerCase())), [data.suppliers, query]);

  const refresh = () => setRevision((value) => value + 1);
  const signOut = () => { logoutUser(); navigate('/login'); };
  const switchView = (key) => { setActive(key); setMobileNav(false); setNotificationOpen(false); setQuery(''); };

  const sidebar = (
    <div className="flex h-full flex-col bg-[#151515] text-white">
      <div className="border-b border-white/10 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border border-gold/70 text-gold"><Scissors size={18} strokeWidth={1.6} /></div>
          <div><p className="font-serif text-2xl uppercase tracking-[.16em]">{siteConfig.brandName}</p><p className="text-[8px] uppercase tracking-[.22em] text-white/40">Studio Operations</p></div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-6">
        <p className="px-3 pb-3 text-[8px] uppercase tracking-[.22em] text-white/30">Management</p>
        <div className="space-y-1">
          {navItems.map(([key, label, Icon]) => (
            <button key={key} onClick={() => switchView(key)} className={`flex w-full items-center gap-3 px-3 py-3 text-left text-xs transition-colors ${active === key ? 'bg-white/[.08] text-gold' : 'text-white/55 hover:bg-white/[.04] hover:text-white'}`}>
              <Icon size={16} strokeWidth={1.6} />
              <span>{label}</span>
              {key === 'orders' && activeOrders > 0 && <span className="ml-auto min-w-5 bg-gold px-1.5 text-center text-[9px] leading-5 text-white">{activeOrders}</span>}
              {key === 'inventory' && lowStock.length > 0 && <span className="ml-auto min-w-5 bg-red-800 px-1.5 text-center text-[9px] leading-5 text-white">{lowStock.length}</span>}
              {key === 'procurement' && openPOs > 0 && <span className="ml-auto min-w-5 bg-white/10 px-1.5 text-center text-[9px] leading-5 text-white">{openPOs}</span>}
            </button>
          ))}
        </div>
      </nav>
      <div className="border-t border-white/10 p-4">
        <div className="mb-4 px-2"><p className="text-xs text-white/75">{session?.name || 'STITCH Admin'}</p><p className="mt-1 truncate text-[9px] text-white/35">{session?.email}</p></div>
        <button onClick={signOut} className="flex w-full items-center gap-3 px-2 py-2 text-xs text-white/45 hover:text-white"><LogOut size={15} /> Sign out</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0EEE9] text-ink">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[244px] lg:block">{sidebar}</aside>
      <AnimatePresence>{mobileNav && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] bg-black/50 lg:hidden" onClick={() => setMobileNav(false)}><motion.aside initial={{ x: -270 }} animate={{ x: 0 }} exit={{ x: -270 }} className="h-full w-[270px]" onClick={(e) => e.stopPropagation()}>{sidebar}</motion.aside></motion.div>}</AnimatePresence>

      <div className="lg:pl-[244px]">
        <header className="sticky top-0 z-30 border-b border-black/10 bg-[#F0EEE9]/95 backdrop-blur-xl">
          <div className="flex min-h-[72px] items-center justify-between gap-4 px-4 sm:px-6 xl:px-8">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileNav(true)} className="p-2 lg:hidden" aria-label="Open admin navigation"><Menu size={20} /></button>
              <div><p className="text-[9px] uppercase tracking-[.2em] text-gold">STITCH / OPERATIONS</p><h1 className="font-serif text-2xl capitalize">{active === 'orders' ? 'Customer orders' : active}</h1></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button onClick={() => setNotificationOpen((open) => !open)} className="relative flex h-10 w-10 items-center justify-center border border-black/10 bg-[#FAF8F3] text-muted transition-colors hover:border-gold hover:text-gold" aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`} aria-expanded={notificationOpen}>
                  <Bell size={16}/>
                  {unreadCount > 0 && <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-semibold text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                </button>
                <AnimatePresence>
                  {notificationOpen && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="absolute right-0 top-12 z-[80] w-[min(380px,calc(100vw-2rem))] overflow-hidden border border-black/10 bg-[#FAF8F3] shadow-2xl">
                      <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
                        <div><p className="text-[9px] uppercase tracking-[.18em] text-gold">Admin notifications</p><p className="mt-1 text-xs text-muted">{unreadCount ? `${unreadCount} unread alert${unreadCount === 1 ? '' : 's'}` : 'You are all caught up'}</p></div>
                        {unreadCount > 0 && <button onClick={markAllNotificationsRead} className="text-[9px] uppercase tracking-[.12em] text-muted hover:text-gold">Mark all read</button>}
                      </div>
                      <div className="max-h-[420px] overflow-y-auto">
                        {!notifications.length ? (
                          <div className="px-5 py-10 text-center"><CheckCircle2 className="mx-auto text-gold" size={22}/><p className="mt-3 text-sm">No notifications right now</p><p className="mt-1 text-[10px] leading-5 text-muted">New appointments, incoming orders, low stock and overdue purchase orders will appear here.</p></div>
                        ) : notifications.map((notification) => {
                          const unread = !readNotificationIds.includes(notification.id);
                          const Icon = notification.type === 'appointment' ? CalendarDays : notification.type === 'stock' ? Boxes : notification.type === 'po' ? Truck : notification.type === 'warning' ? AlertTriangle : ShoppingBag;
                          return <button key={notification.id} onClick={() => openNotification(notification)} className={`flex w-full gap-3 border-b border-black/[.07] px-4 py-4 text-left transition-colors last:border-b-0 hover:bg-black/[.025] ${unread ? 'bg-gold/[.06]' : ''}`}>
                            <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border ${unread ? 'border-gold/40 text-gold' : 'border-black/10 text-muted'}`}><Icon size={14}/></span>
                            <span className="min-w-0 flex-1"><span className="flex items-start justify-between gap-3"><span className="text-xs font-medium text-ink">{notification.title}</span>{unread && <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"/>}</span><span className="mt-1 block text-[10px] leading-5 text-muted">{notification.message}</span></span>
                          </button>;
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button onClick={() => setPurchaseOpen(true)} className="flex h-10 items-center gap-2 bg-ink px-3.5 text-[9px] uppercase tracking-[.14em] text-white transition-colors hover:bg-gold"><PackagePlus size={14}/> <span className="hidden sm:inline">Purchase materials</span></button>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 xl:p-8">
          <div className="mx-auto max-w-[1540px]">
            {active === 'overview' && (
              <>
                <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                  <div>
                    <div className="flex items-center gap-3"><p className="eyebrow">LIVE BUSINESS OVERVIEW</p></div>
                    <h2 className="mt-2 font-serif text-4xl sm:text-5xl">Your studio, as it is.</h2>
                    <p className="mt-3 max-w-2xl text-xs leading-6 text-muted">Figures come only from records created in STITCH: customer accounts, appointment requests, customer orders, inventory, suppliers and purchase orders. Empty charts mean no real record has been entered yet.</p>
                  </div>
                  <label className="relative w-full max-w-[190px] text-[9px] uppercase tracking-[.14em] text-muted"><span className="sr-only">Date range</span><select value={range} onChange={(e) => setRange(Number(e.target.value))} className="appearance-none bg-[#FAF8F3] pr-9 text-xs normal-case tracking-normal text-ink">{ranges.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" size={14}/></label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
                  <StatCard label="Cash collected" value={money(cashCollected)} meta={`${money(outstanding)} outstanding`} icon={WalletCards} values={timeline.map((item) => item.revenue)} />
                  <StatCard label="Active jobs" value={activeOrders} meta={`${data.orders.length} customer orders recorded`} icon={ShoppingBag} values={timeline.map((item) => item.orders)} />
                  <StatCard label="Customers" value={data.customers.length} meta="Registered website accounts" icon={Users} />
                  <StatCard label="Appointments" value={pendingAppointments} meta={`${data.appointments.length} total requests · ${pendingAppointments} pending`} icon={CalendarDays} />
                  <StatCard label="Purchasing" value={money(procurementSpend)} meta={`${openPOs} open purchase orders`} icon={Truck} />
                  <StatCard label="Low stock" value={lowStock.length} meta={`${money(inventoryValue)} inventory value`} icon={AlertTriangle} tone={lowStock.length ? 'alert' : 'default'} />
                </div>

                <div className="mt-5 grid gap-5 2xl:grid-cols-[1.55fr_.85fr]">
                  <Panel title="Cash collected" eyebrow="PAYMENT TREND"><RevenueLineChart data={timeline}/></Panel>
                  <Panel title="Tailoring workflow" eyebrow="ORDER STATUS"><DonutChart segments={statusSegments} totalLabel="Orders" emptyMessage="Record a customer order to see the workflow mix."/></Panel>
                </div>

                <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
                  <Panel title="Order value by category" eyebrow="BAR GRAPH"><VerticalBarChart data={categoryOrderValue} valueFormatter={(value) => value >= 1000 ? `${Math.round(value / 1000)}k` : Math.round(value)} emptyMessage="Record customer orders to compare category value."/></Panel>
                  <Panel title="Wholesale spend" eyebrow="BY SUPPLIER"><HorizontalBars data={supplierSpend} valueFormatter={money} emptyMessage="Create purchase orders to compare wholesale purchasing."/></Panel>
                </div>

                <div className="mt-5 grid gap-5 xl:grid-cols-3">
                  <Panel title="Appointment demand" eyebrow="SERVICES"><HorizontalBars data={serviceDemand} emptyMessage="Website appointment requests will appear here automatically."/></Panel>
                  <Panel title="Inventory attention" eyebrow="REORDER">
                    {lowStock.length ? <div className="space-y-4">{lowStock.slice(0, 7).map((item) => <div key={item.id} className="flex items-center justify-between gap-5 border-b border-black/10 pb-3 last:border-0 last:pb-0"><div className="min-w-0"><p className="truncate text-xs">{item.item}</p><p className="mt-1 text-[9px] uppercase tracking-[.12em] text-muted">Reorder at {item.reorderAt} {item.unit}</p></div><span className="flex items-center gap-1.5 text-xs text-red-800"><AlertTriangle size={13}/>{item.stock} {item.unit}</span></div>)}</div> : <EmptyState title="Stock looks clear" copy="Add inventory items and reorder points to make low-stock monitoring useful."/>}
                  </Panel>
                  <Panel title="Procurement queue" eyebrow="OPEN PURCHASE ORDERS">
                    {data.purchaseOrders.filter((po) => !['Received', 'Cancelled'].includes(po.status)).length ? <div className="space-y-4">{data.purchaseOrders.filter((po) => !['Received', 'Cancelled'].includes(po.status)).slice(0, 6).map((po) => <button key={po.id} onClick={() => switchView('procurement')} className="flex w-full items-center justify-between gap-4 border-b border-black/10 pb-3 text-left last:border-0"><div><p className="text-xs font-medium">{po.id}</p><p className="mt-1 text-[9px] text-muted">{supplierName(po.supplierId, data.suppliers)}</p></div><div className="text-right"><StatusPill status={po.status}/><p className="mt-2 text-xs">{money(po.total)}</p></div></button>)}</div> : <EmptyState title="No purchase orders" copy="Use Purchase materials to order fabric, lining, buttons, trims and other raw materials from your wholesale dealers."/>}
                  </Panel>
                </div>
              </>
            )}

            {active === 'orders' && (
              <Panel title="Customer order book" eyebrow="TAILORING WORKFLOW" action={<div className="flex gap-4"><button onClick={() => exportOrdersCsv(visibleOrders)} className="flex items-center gap-2 text-[9px] uppercase tracking-[.15em] text-muted hover:text-gold"><Download size={13}/> Export</button><button onClick={() => setCustomerOrderOpen(true)} className="flex items-center gap-2 text-[9px] uppercase tracking-[.15em] text-gold"><Plus size={13}/> Record order</button></div>}>
                <div className="mb-6 grid gap-3 md:grid-cols-[1fr_210px]"><div className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search order, customer or item" className="pl-9"/></div><select value={orderStatusFilter} onChange={(e) => setOrderStatusFilter(e.target.value)}><option>All</option>{orderStatuses.map((status) => <option key={status}>{status}</option>)}</select></div>
                {!visibleOrders.length ? <EmptyState title="No customer orders yet" copy="This page contains only orders you actually record for clients. No sample orders are inserted." action={<button onClick={() => setCustomerOrderOpen(true)} className="bg-ink px-5 py-3 text-[10px] uppercase tracking-[.16em] text-white">Record first order</button>}/> : <div className="overflow-x-auto"><table className="w-full min-w-[1080px] text-left text-xs"><thead className="border-b border-black/10 text-[9px] uppercase tracking-[.14em] text-muted"><tr><th className="pb-3 font-medium">Order</th><th className="pb-3 font-medium">Client</th><th className="pb-3 font-medium">Item</th><th className="pb-3 font-medium">Due</th><th className="pb-3 font-medium">Payment</th><th className="pb-3 font-medium">Paid</th><th className="pb-3 font-medium">Status</th><th className="pb-3 text-right font-medium">Value</th></tr></thead><tbody>{visibleOrders.map((order) => <tr key={order.id} className="border-b border-black/[.07]"><td className="py-4 font-medium">{order.id}</td><td className="py-4">{order.customer}</td><td className="max-w-[230px] truncate py-4 text-muted">{order.item}</td><td className="py-4 text-muted">{shortDate(order.dueDate)}</td><td className="py-3"><select className="min-w-[130px] py-2 text-xs" value={order.payment} onChange={(e) => { const payment = e.target.value; const paid = payment === 'Paid' ? order.amount : ['Pending', 'Refunded'].includes(payment) ? 0 : order.paidAmount; updateOrderPayment(order.id, payment, paid); refresh(); }}>{paymentStatuses.map((status) => <option key={status}>{status}</option>)}</select></td><td className="py-3"><input className="w-28 py-2" type="number" min="0" max={order.amount} value={order.paidAmount || 0} onChange={(e) => { updateOrderPayment(order.id, order.payment, e.target.value); refresh(); }}/></td><td className="py-3"><select className="min-w-[145px] py-2 text-xs" value={order.status} onChange={(e) => { updateOrderStatus(order.id, e.target.value); refresh(); }}>{orderStatuses.map((status) => <option key={status}>{status}</option>)}</select></td><td className="py-4 text-right font-medium">{money(order.amount)}</td></tr>)}</tbody></table></div>}
              </Panel>
            )}

            {active === 'appointments' && (
              <Panel title="Appointment desk" eyebrow="REAL WEBSITE REQUESTS">
                <div className="relative mb-6 max-w-xl"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search client, service or date" className="pl-9"/></div>
                {!visibleAppointments.length ? <EmptyState title="No appointment requests yet" copy="When a customer submits the public appointment form, that real request appears here."/> : <div className="overflow-x-auto"><table className="w-full min-w-[1120px] text-left text-xs"><thead className="border-b border-black/10 text-[9px] uppercase tracking-[.14em] text-muted"><tr><th className="pb-3 font-medium">Client</th><th className="pb-3 font-medium">Garment</th><th className="pb-3 font-medium">Fabric</th><th className="pb-3 font-medium">Preferences</th><th className="pb-3 font-medium">Date</th><th className="pb-3 font-medium">Time</th><th className="pb-3 font-medium">Location</th><th className="pb-3 font-medium">Status</th></tr></thead><tbody>{visibleAppointments.map((appointment) => <tr key={appointment.id || appointment.createdAt} className="border-b border-black/[.07] align-top"><td className="py-4"><p>{appointment.name}</p><p className="mt-1 text-[9px] text-muted">{appointment.phone}</p></td><td className="max-w-[190px] py-4"><p>{appointment.product || appointment.service || '—'}</p><p className="mt-1 text-[9px] text-muted">{appointment.service || 'Tailoring'}</p></td><td className="max-w-[180px] py-4 text-muted">{appointment.fabric || 'Decide at fitting'}</td><td className="max-w-[220px] py-4 text-muted"><p>{appointment.fit || '—'} · {appointment.styleDirection || '—'}</p><p className="mt-1 text-[9px]">{appointment.personalization || '—'}</p></td><td className="py-4">{shortDate(appointment.date)}</td><td className="py-4 text-muted">{appointment.time}</td><td className="py-4 text-muted">{appointment.location}</td><td className="py-3"><select className="min-w-[130px] py-2 text-xs" value={appointment.status || 'Pending'} onChange={(e) => { updateAppointmentStatus(appointment.id, e.target.value); refresh(); }}>{appointmentStatuses.map((status) => <option key={status}>{status}</option>)}</select></td></tr>)}</tbody></table></div>}
              </Panel>
            )}

            {active === 'customers' && (
              <Panel title="Customer directory" eyebrow="REGISTERED ACCOUNTS">
                <div className="relative mb-6 max-w-xl"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search customer, email or phone" className="pl-9"/></div>
                {!visibleCustomers.length ? <EmptyState title="No registered customers" copy="Real customer accounts created through the Sign Up page will appear here automatically."/> : <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{visibleCustomers.map((customer) => <div key={customer.id} className="border border-black/10 bg-white/30 p-5 transition-colors hover:border-gold/40"><div className="flex items-start justify-between gap-4"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink font-serif text-lg text-white">{customer.name?.charAt(0) || 'C'}</div><span className="text-[9px] uppercase tracking-[.12em] text-muted">Website account</span></div><p className="mt-5 text-sm font-medium">{customer.name}</p><p className="mt-2 truncate text-xs text-muted">{customer.email}</p><p className="mt-1 text-xs text-muted">{customer.phone}</p><p className="mt-5 border-t border-black/10 pt-3 text-[9px] uppercase tracking-[.12em] text-muted">Joined {shortDate(customer.joinedAt)}</p></div>)}</div>}
              </Panel>
            )}

            {active === 'inventory' && (
              <Panel title="Inventory control" eyebrow="PRODUCTS & RAW MATERIALS" action={<div className="flex flex-wrap items-center gap-4"><button onClick={() => setSupplierOpen(true)} className="flex items-center gap-2 text-[9px] uppercase tracking-[.15em] text-muted transition-colors hover:text-gold"><Store size={13}/> Add supplier</button><button onClick={() => setInventoryOpen(true)} className="flex items-center gap-2 text-[9px] uppercase tracking-[.15em] text-gold"><Plus size={13}/> Add item</button></div>}>
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="relative w-full max-w-xl"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search product, material, group or supplier" className="pl-9"/></div><p className="text-[10px] text-muted">Stock value: <strong className="text-ink">{money(inventoryValue)}</strong></p></div>
                {!visibleInventory.length ? <EmptyState title="Inventory is empty" copy="Products, fabrics and supporting materials appear here. Set stock and costs manually, or receive a raw-material purchase order to increase matching material stock." action={<button onClick={() => setInventoryOpen(true)} className="bg-ink px-5 py-3 text-[10px] uppercase tracking-[.16em] text-white">Add inventory item</button>}/> : <div className="overflow-x-auto"><table className="w-full min-w-[960px] text-left text-xs"><thead className="border-b border-black/10 text-[9px] uppercase tracking-[.14em] text-muted"><tr><th className="pb-3 font-medium">Item</th><th className="pb-3 font-medium">Group</th><th className="pb-3 font-medium">Supplier</th><th className="pb-3 font-medium">Stock</th><th className="pb-3 font-medium">Reorder</th><th className="pb-3 font-medium">Unit cost</th><th className="pb-3 font-medium">Stock value</th><th className="pb-3 font-medium">Health</th></tr></thead><tbody>{visibleInventory.map((item) => { const needsSetup = Number(item.stock) === 0 && Number(item.reorderAt) === 0 && Number(item.unitCost) === 0; const low = !needsSetup && Number(item.reorderAt) > 0 && Number(item.stock) <= Number(item.reorderAt); return <tr key={item.id} className="border-b border-black/[.07]"><td className="py-4 font-medium">{item.item}</td><td className="py-4 text-muted">{item.group}</td><td className="py-3"><select className="min-w-[150px] py-2 text-xs" value={item.supplierId || ''} onChange={(e) => { updateInventoryItem(item.id, { supplierId: e.target.value }); refresh(); }}><option value="">None</option>{data.suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.businessName}</option>)}</select></td><td className="py-3"><StockControl item={item} onCommit={(stock) => { updateInventoryItem(item.id, { stock }); refresh(); }}/></td><td className="py-3"><input className="w-24 py-2" type="number" min="0" step="0.01" value={item.reorderAt} onChange={(e) => { updateInventoryItem(item.id, { reorderAt: e.target.value }); refresh(); }}/></td><td className="py-3"><input className="w-28 py-2" type="number" min="0" step="0.01" value={Math.round(Number(item.unitCost || 0) * 100) / 100} onChange={(e) => { updateInventoryItem(item.id, { unitCost: e.target.value }); refresh(); }}/></td><td className="py-4">{money(Number(item.stock) * Number(item.unitCost))}</td><td className="py-4">{needsSetup ? <span className="inline-flex items-center gap-1.5 text-muted">Set stock</span> : low ? <span className="inline-flex items-center gap-1.5 text-red-800"><AlertTriangle size={13}/> Reorder</span> : <span className="inline-flex items-center gap-1.5 text-emerald-800"><CheckCircle2 size={13}/> Healthy</span>}</td></tr>; })}</tbody></table></div>}
              </Panel>
            )}

            {active === 'procurement' && (
              <Panel title="Raw-material procurement" eyebrow="PURCHASE ORDERS" action={<div className="flex gap-4"><button onClick={() => exportPurchaseOrdersCsv(visiblePOs, data.suppliers)} className="flex items-center gap-2 text-[9px] uppercase tracking-[.15em] text-muted hover:text-gold"><Download size={13}/> Export</button><button onClick={() => setPurchaseOpen(true)} className="flex items-center gap-2 text-[9px] uppercase tracking-[.15em] text-gold"><Plus size={13}/> New PO</button></div>}>
                <div className="relative mb-6 max-w-xl"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search PO, supplier or material" className="pl-9"/></div>
                {!visiblePOs.length ? <EmptyState title="No purchase orders yet" copy="Create purchase orders for the raw materials STITCH buys from suppliers: fabric, lining, canvas, buttons, thread, zippers, trims, packaging and related tailoring materials." action={<button onClick={() => setPurchaseOpen(true)} className="bg-ink px-5 py-3 text-[10px] uppercase tracking-[.16em] text-white">Create first PO</button>}/> : <div className="overflow-x-auto"><table className="w-full min-w-[1180px] text-left text-xs"><thead className="border-b border-black/10 text-[9px] uppercase tracking-[.14em] text-muted"><tr><th className="pb-3 font-medium">PO</th><th className="pb-3 font-medium">Supplier</th><th className="pb-3 font-medium">Materials</th><th className="pb-3 font-medium">Expected</th><th className="pb-3 font-medium">Payment</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium">Contact</th><th className="pb-3 text-right font-medium">Total</th></tr></thead><tbody>{visiblePOs.map((po) => { const supplier = data.suppliers.find((item) => item.id === po.supplierId); return <tr key={po.id} className="border-b border-black/[.07]"><td className="py-4"><p className="font-medium">{po.id}</p><p className="mt-1 text-[9px] text-muted">{shortDate(po.createdAt)}</p></td><td className="py-4">{supplier?.businessName || '—'}</td><td className="max-w-[280px] py-4 text-muted"><p className="truncate">{po.items.map((item) => item.name).join(', ')}</p><p className="mt-1 text-[9px]">{po.items.length} line{po.items.length === 1 ? '' : 's'}</p></td><td className="py-4 text-muted">{shortDate(po.expectedDate)}</td><td className="py-3"><select className="min-w-[120px] py-2 text-xs" value={po.paymentStatus} onChange={(e) => { updatePurchaseOrderPayment(po.id, e.target.value); refresh(); }}>{poPayments.map((status) => <option key={status}>{status}</option>)}</select></td><td className="py-3"><select className="min-w-[150px] py-2 text-xs" value={po.status} onChange={(e) => { const status = e.target.value; if (status === 'Received') { const result = receivePurchaseOrder(po.id); if (!result.ok) window.alert(result.message); } else { updatePurchaseOrderStatus(po.id, status); } refresh(); }}>{poStatuses.map((status) => <option key={status}>{status}</option>)}</select></td><td className="py-3"><div className="flex gap-2"><button onClick={() => openWhatsApp(po, supplier)} title="Open order in WhatsApp" className="flex h-9 w-9 items-center justify-center border border-black/10 hover:border-gold hover:text-gold"><MessageCircle size={14}/></button><button onClick={() => openEmail(po, supplier)} title="Email purchase order" className="flex h-9 w-9 items-center justify-center border border-black/10 hover:border-gold hover:text-gold"><Mail size={14}/></button>{!po.receivedAt && <button onClick={() => { if (window.confirm(`Receive ${po.id} into inventory? This adds every PO line to stock and can only be done once.`)) { const result = receivePurchaseOrder(po.id); if (!result.ok) window.alert(result.message); refresh(); } }} title="Receive into inventory" className="flex h-9 w-9 items-center justify-center border border-black/10 hover:border-gold hover:text-gold"><PackageSearch size={14}/></button>}</div></td><td className="py-4 text-right font-medium">{money(po.total)}</td></tr>; })}</tbody></table></div>}
                <div className="mt-6 border-t border-black/10 pt-5 text-[10px] leading-5 text-muted"><strong className="text-ink">How receiving works:</strong> when a PO is marked Received, its quantities are added to Inventory once. Existing matching items get their stock increased and unit cost recalculated as a weighted average.</div>
              </Panel>
            )}

            {active === 'suppliers' && (
              <Panel title="Suppliers" eyebrow="SUPPLIER DIRECTORY" action={<button onClick={() => setSupplierOpen(true)} className="flex items-center gap-2 text-[9px] uppercase tracking-[.15em] text-gold"><Plus size={13}/> Add supplier</button>}>
                <div className="relative mb-6 max-w-xl"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search supplier, contact or location" className="pl-9"/></div>
                {!visibleSuppliers.length ? <EmptyState title="No suppliers saved" copy="Add raw-material suppliers, ready-made wholesalers or production partners and assign them to inventory items." action={<button onClick={() => setSupplierOpen(true)} className="bg-ink px-5 py-3 text-[10px] uppercase tracking-[.16em] text-white">Add supplier</button>}/> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visibleSuppliers.map((supplier) => { const spend = data.purchaseOrders.filter((po) => po.supplierId === supplier.id && po.status !== 'Cancelled').reduce((sum, po) => sum + Number(po.total || 0), 0); return <article key={supplier.id} className="border border-black/10 bg-white/25 p-5 transition-all hover:border-gold/40 hover:shadow-[0_12px_35px_rgba(20,18,14,.05)]"><div className="flex items-start justify-between gap-4"><div><p className="text-[9px] uppercase tracking-[.14em] text-gold">{supplier.id}</p><h3 className="mt-2 font-serif text-2xl">{supplier.businessName}</h3><p className="mt-1 text-[8px] uppercase tracking-[.14em] text-muted">{supplier.supplierType || 'Raw Material'}</p></div><button onClick={() => { if (window.confirm(`Remove ${supplier.businessName}? Existing purchase orders will keep the supplier ID.`)) { deleteSupplier(supplier.id); refresh(); } }} className="text-muted hover:text-red-800" aria-label="Delete supplier"><X size={15}/></button></div><p className="mt-4 text-xs text-muted">{supplier.contactPerson || 'No contact person'}{supplier.address ? ` · ${supplier.address}` : ''}</p><div className="mt-5 grid grid-cols-2 gap-3 border-y border-black/10 py-4"><div><p className="text-[8px] uppercase tracking-[.14em] text-muted">Purchase value</p><p className="mt-1 text-sm">{money(spend)}</p></div><div><p className="text-[8px] uppercase tracking-[.14em] text-muted">Orders</p><p className="mt-1 text-sm">{data.purchaseOrders.filter((po) => po.supplierId === supplier.id).length}</p></div></div><div className="mt-4 flex flex-wrap gap-2">{supplier.whatsapp && <a href={`https://wa.me/${String(supplier.whatsapp).replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 border border-black/10 px-3 py-2 text-[9px] uppercase tracking-[.12em] hover:border-gold hover:text-gold"><MessageCircle size={12}/> WhatsApp</a>}{supplier.phone && <a href={`tel:${supplier.phone}`} className="flex items-center gap-2 border border-black/10 px-3 py-2 text-[9px] uppercase tracking-[.12em] hover:border-gold hover:text-gold">Call</a>}{supplier.email && <a href={`mailto:${supplier.email}`} className="flex items-center gap-2 border border-black/10 px-3 py-2 text-[9px] uppercase tracking-[.12em] hover:border-gold hover:text-gold"><Mail size={12}/> Email</a>}{(!supplier.supplierType || supplier.supplierType === 'Raw Material') && <button onClick={() => { setPurchaseOpen(true); }} className="flex items-center gap-2 border border-black/10 px-3 py-2 text-[9px] uppercase tracking-[.12em] hover:border-gold hover:text-gold"><FileText size={12}/> New PO</button>}</div>{supplier.notes && <p className="mt-4 text-[10px] leading-5 text-muted">{supplier.notes}</p>}</article>; })}</div>}
              </Panel>
            )}

            <div className="mt-5 flex flex-col justify-between gap-2 border-t border-black/10 pt-4 text-[9px] uppercase tracking-[.12em] text-muted sm:flex-row"><p>Admin records are stored on this device</p><p>Connect a backend before multi-device production use</p></div>
          </div>
        </main>
      </div>

      <CustomerOrderModal open={customerOrderOpen} onClose={() => setCustomerOrderOpen(false)} onSave={(order) => { addCustomerOrder(order); refresh(); }} />
      <SupplierModal open={supplierOpen} onClose={() => setSupplierOpen(false)} onSave={(supplier) => { addSupplier(supplier); refresh(); }} />
      <InventoryModal open={inventoryOpen} onClose={() => setInventoryOpen(false)} onSave={(item) => { addInventoryItem(item); refresh(); }} suppliers={data.suppliers} onNeedSupplier={() => { setSupplierOpen(true); setActive('suppliers'); }} />
      <PurchaseOrderModal open={purchaseOpen} onClose={() => setPurchaseOpen(false)} onSave={(order) => { const created = createPurchaseOrder(order); refresh(); setActive('procurement'); return created; }} suppliers={data.suppliers} onNeedSupplier={() => { setSupplierOpen(true); setActive('suppliers'); }} />
    </div>
  );
}
