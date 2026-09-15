import { Check, ChevronLeft, ChevronRight, Clock3, MapPin, MessageCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/common/Button';
import SectionHeader from '../components/common/SectionHeader';
import { collections } from '../data/collections';
import { fabricGroups } from '../data/fabrics';
import useLocalStorage from '../hooks/useLocalStorage';
import { getAdminInventory } from '../utils/adminStorage';
import { digitsOnly, isValidPhone } from '../utils/phone';

const times = ['10:00 AM', '11:30 AM', '1:00 PM', '2:30 PM', '4:00 PM', '5:30 PM'];
const steps = ['Garment', 'Fabric', 'Style', 'Location', 'Date', 'Time', 'Details', 'Notes', 'Review'];
const fitOptions = ['Slim', 'Balanced', 'Relaxed'];
const styleOptions = ['Classic', 'Contemporary', 'Tailor Recommendation'];
const personalizationOptions = ['No Monogram', 'Initials', 'Full Name'];
const defaultForm = {
  product: '',
  productSlug: '',
  service: '',
  fabric: '',
  fabricCode: '',
  fit: 'Balanced',
  styleDirection: 'Tailor Recommendation',
  personalization: 'No Monogram',
  location: 'At Studio',
  date: '',
  time: '',
  name: '',
  phone: '',
  email: '',
  contact: 'Phone',
  occasion: '',
  eventDate: '',
  notes: '',
};

export default function Appointment() {
  const navigate = useNavigate();
  const [form, setForm] = useLocalStorage('stitch_appointment_draft', defaultForm);
  const [step, setStep] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [gender, setGender] = useState('All');
  const [inventory, setInventory] = useState(() => getAdminInventory());
  const [searchParams] = useSearchParams();

  const selectedProduct = collections.find((item) => item.slug === form.productSlug || item.name === form.product);
  const selectedFabric = fabricGroups.find((item) => item.name === form.fabric);
  const productParam = searchParams.get('product');
  const editParam = searchParams.get('edit');
  const isEditing = Boolean(editParam);

  useEffect(() => {
    const refreshInventory = () => setInventory(getAdminInventory());
    window.addEventListener('focus', refreshInventory);
    window.addEventListener('storage', refreshInventory);
    return () => {
      window.removeEventListener('focus', refreshInventory);
      window.removeEventListener('storage', refreshInventory);
    };
  }, []);

  useEffect(() => {
    if (!productParam) return;
    const product = collections.find((item) => item.slug === productParam);
    if (!product) return;
    setForm((current) => ({
      ...defaultForm,
      ...current,
      product: product.name,
      productSlug: product.slug,
      service: product.type,
    }));
  }, [productParam, setForm]);

  useEffect(() => {
    if (!editParam) return;
    try {
      const existing = JSON.parse(localStorage.getItem('stitch_bookings') || '[]');
      const booking = Array.isArray(existing) ? existing.find((item) => item.id === editParam) : null;
      if (!booking) return;
      setForm({ ...defaultForm, ...booking });
      setStep(0);
      setConfirmed(false);
    } catch {
      // Keep the fitting form usable if stored booking data is malformed.
    }
  }, [editParam, setForm]);

  const stockFor = (fabric) => {
    const row = inventory.find((entry) => String(entry.item || '').trim().toLowerCase() === fabric.name.trim().toLowerCase());
    return Math.max(0, Number(row?.stock || 0));
  };

  const unitFor = (fabric) => inventory.find((entry) => String(entry.item || '').trim().toLowerCase() === fabric.name.trim().toLowerCase())?.unit || 'm';

  const filteredProducts = useMemo(
    () => collections.filter((item) => gender === 'All' || item.gender === gender),
    [gender]
  );

  const canNext = useMemo(() => {
    if (step === 0) return !!form.product;
    if (step === 1) return !!form.fabric;
    if (step === 2) return !!form.fit && !!form.styleDirection && !!form.personalization;
    if (step === 3) return !!form.location;
    if (step === 4) return !!form.date;
    if (step === 5) return !!form.time;
    if (step === 6) return form.name && isValidPhone(form.phone) && form.email?.includes('@');
    return true;
  }, [step, form]);

  const update = (key, value) => setForm((current) => ({ ...defaultForm, ...current, [key]: value }));

  const selectProduct = (product) => {
    setForm((current) => ({
      ...defaultForm,
      ...current,
      product: product.name,
      productSlug: product.slug,
      service: product.type,
    }));
  };

  const selectFabric = (fabric) => {
    if (fabric === 'Decide at fitting') {
      setForm((current) => ({ ...defaultForm, ...current, fabric: 'Decide at fitting', fabricCode: '' }));
      return;
    }
    if (stockFor(fabric) <= 0) return;
    setForm((current) => ({ ...defaultForm, ...current, fabric: fabric.name, fabricCode: fabric.code }));
  };

  const submit = () => {
    const now = new Date().toISOString();
    try {
      const existing = JSON.parse(localStorage.getItem('stitch_bookings') || '[]');
      const list = Array.isArray(existing) ? existing : [];
      const current = editParam ? list.find((item) => item.id === editParam) : null;
      const booking = {
        ...(current || {}),
        ...defaultForm,
        ...form,
        id: current?.id || `WEB-APT-${Date.now()}`,
        status: 'Pending',
        createdAt: current?.createdAt || now,
        updatedAt: now,
      };
      const next = current
        ? list.map((item) => item.id === current.id ? booking : item)
        : [booking, ...list];
      localStorage.setItem('stitch_bookings', JSON.stringify(next));
      localStorage.setItem('stitch_booking', JSON.stringify(booking));
    } catch {
      const booking = {
        ...defaultForm,
        ...form,
        id: `WEB-APT-${Date.now()}`,
        status: 'Pending',
        createdAt: now,
        updatedAt: now,
      };
      localStorage.setItem('stitch_bookings', JSON.stringify([booking]));
      localStorage.setItem('stitch_booking', JSON.stringify(booking));
    }
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <section className="flex min-h-[78vh] items-center pb-20 pt-32">
        <div className="container-lux">
          <div className="mx-auto max-w-2xl border border-black/10 bg-[#FAF8F3] p-8 text-center shadow-soft sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold text-gold"><Check /></div>
            <p className="eyebrow mt-7">{isEditing ? 'REQUEST UPDATED' : 'REQUEST SAVED'}</p>
            <h1 className="mt-4 font-serif text-5xl">{isEditing ? 'Your fitting request has been updated.' : 'Your fitting request is ready.'}</h1>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-muted">
              {isEditing ? 'Your revised date, time and tailoring preferences have been sent back to the studio for review.' : 'Your garment, cloth and tailoring preferences have been recorded for the studio to review before confirming your appointment.'}
            </p>
            <div className="mt-8 border-y border-black/15 py-6 text-left text-sm">
              <p><strong>{form.product}</strong> · {form.location}</p>
              <p className="mt-2 text-muted">Fabric: {form.fabric}</p>
              <p className="mt-2 text-muted">{form.fit} fit · {form.styleDirection} · {form.personalization}</p>
              <p className="mt-2 text-muted">{form.date} at {form.time}</p>
              <p className="mt-2 text-muted">{form.name} · {form.phone}</p>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-3"><Button to="/my-activity">View / Manage Bookings</Button><Button onClick={() => { setConfirmed(false); setStep(0); setForm(defaultForm); navigate('/appointment', { replace: true }); }} variant="outline">Make Another Request</Button></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-20 pt-36 sm:pb-28 sm:pt-44">
      <div className="container-lux">
        <SectionHeader
          label="PRIVATE FITTING"
          title={isEditing ? "Change your tailoring request" : "Build your tailoring request"}
          copy={isEditing ? "Review the existing request and change the garment, fabric, preferences, location, date or time. Saving sends the revised request back to the studio for confirmation." : "Choose the garment you want tailored, select an available cloth, set your initial style preferences and then reserve a fitting time. Final details can still be refined with the tailor in person."}
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-14">
          <aside className="h-fit border-t border-black/15 pt-6 lg:sticky lg:top-28">
            <p className="text-[9px] uppercase tracking-[.2em] text-gold">YOUR REQUEST</p>
            <div className="mt-5 space-y-4 text-sm text-muted">
              <p className="flex items-start gap-3"><MapPin size={16} className="mt-0.5 text-ink"/> Pokhara studio or virtual consultation</p>
              <p className="flex items-start gap-3"><Clock3 size={16} className="mt-0.5 text-ink"/> Preferred times are reviewed before confirmation</p>
              <p className="flex items-start gap-3"><MessageCircle size={16} className="mt-0.5 text-ink"/> Your garment and fabric choices are sent to the admin desk</p>
            </div>

            {(form.product || form.fabric) && (
              <div className="mt-7 border-t border-black/15 pt-5 text-xs">
                {form.product && <p><span className="text-muted">Garment</span><br/><strong className="font-medium">{form.product}</strong></p>}
                {form.fabric && <p className="mt-3"><span className="text-muted">Fabric</span><br/><strong className="font-medium">{form.fabric}</strong></p>}
              </div>
            )}

            <div className="mt-8 border-t border-black/15 pt-5">
              <p className="text-[9px] uppercase tracking-[.18em] text-muted">Progress</p>
              <div className="mt-4 space-y-1">
                {steps.map((label, i) => (
                  <div key={label} className={`flex items-center gap-3 py-2 text-sm ${i === step ? 'text-ink' : i < step ? 'text-gold' : 'text-muted/65'}`}>
                    <span className="w-6 text-[9px]">{String(i + 1).padStart(2, '0')}</span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="min-h-[520px] border-t border-black/15 pt-8">
            {step === 0 && (
              <div>
                <p className="eyebrow">STEP 1</p>
                <h2 className="mt-3 font-serif text-4xl sm:text-5xl">What would you like us to tailor?</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">Choose the exact reference style. The tailor will use it as the starting point, then adjust measurements, details and construction for you.</p>
                <div className="mt-6 flex gap-2">
                  {['All', 'Men', 'Women'].map((value) => <button key={value} onClick={() => setGender(value)} className={`border px-4 py-2 text-[9px] uppercase tracking-[.14em] ${gender === value ? 'border-ink bg-ink text-white' : 'border-black/15 hover:border-gold'}`}>{value}</button>)}
                </div>
                <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => {
                    const selected = form.productSlug === product.slug || form.product === product.name;
                    return (
                      <button key={product.slug} type="button" onClick={() => selectProduct(product)} className={`group overflow-hidden border text-left transition ${selected ? 'border-ink ring-1 ring-ink' : 'border-black/10 hover:border-gold'}`}>
                        <div className="aspect-[4/3] overflow-hidden bg-warm"><img src={product.image} alt={product.name} className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-[1.02]" onError={(event) => { event.currentTarget.src = '/images/fallback-product.svg'; }}/></div>
                        <div className={`p-4 ${selected ? 'bg-ink text-white' : 'bg-white/25'}`}>
                          <p className={`text-[8px] uppercase tracking-[.16em] ${selected ? 'text-white/60' : 'text-gold'}`}>{product.gender} · {product.type}</p>
                          <p className="mt-2 font-serif text-xl leading-tight">{product.name}</p>
                          <p className={`mt-2 text-[10px] ${selected ? 'text-white/60' : 'text-muted'}`}>From Rs. {product.price.toLocaleString()}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <p className="eyebrow">STEP 2</p>
                <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Which fabric would you like?</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">Only cloth currently recorded in inventory can be selected. If you are unsure, choose “Decide at fitting” and compare physical swatches with the tailor.</p>
                <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <button type="button" onClick={() => selectFabric('Decide at fitting')} className={`min-h-48 border p-5 text-left transition ${form.fabric === 'Decide at fitting' ? 'border-ink bg-ink text-white' : 'border-black/10 bg-white/25 hover:border-gold'}`}>
                    <p className={`text-[8px] uppercase tracking-[.16em] ${form.fabric === 'Decide at fitting' ? 'text-white/60' : 'text-gold'}`}>Studio selection</p>
                    <p className="mt-4 font-serif text-2xl">Decide at fitting</p>
                    <p className={`mt-3 text-xs leading-6 ${form.fabric === 'Decide at fitting' ? 'text-white/65' : 'text-muted'}`}>See and feel available swatches in person before confirming the cloth.</p>
                  </button>
                  {fabricGroups.map((fabric) => {
                    const stock = stockFor(fabric);
                    const available = stock > 0;
                    const selected = form.fabric === fabric.name;
                    return (
                      <button key={fabric.id} type="button" disabled={!available} onClick={() => selectFabric(fabric)} className={`group overflow-hidden border text-left transition ${selected ? 'border-ink ring-1 ring-ink' : available ? 'border-black/10 hover:border-gold' : 'cursor-not-allowed border-black/5 opacity-45'}`}>
                        <div className="relative aspect-square overflow-hidden bg-warm">
                          <img src={fabric.image} alt={fabric.name} className="h-full w-full object-cover" onError={(event) => { event.currentTarget.src = '/images/fabrics/fallback-fabric.svg'; }}/>
                          <span className={`absolute left-3 top-3 border px-2.5 py-1.5 text-[8px] uppercase tracking-[.14em] ${available ? 'border-emerald-700/25 bg-cream/95 text-emerald-800' : 'border-red-900/20 bg-cream/95 text-red-900'}`}>{available ? `${stock} ${unitFor(fabric)} available` : 'Not Available'}</span>
                        </div>
                        <div className={`p-4 ${selected ? 'bg-ink text-white' : 'bg-white/25'}`}>
                          <p className={`text-[8px] uppercase tracking-[.16em] ${selected ? 'text-white/60' : 'text-gold'}`}>{fabric.material} · {fabric.pattern}</p>
                          <p className="mt-2 font-serif text-xl leading-tight">{fabric.name}</p>
                          <p className={`mt-2 text-[10px] ${selected ? 'text-white/60' : 'text-muted'}`}>{fabric.color} · {fabric.weight}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <p className="eyebrow">STEP 3</p>
                <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Set your starting preferences.</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">These choices guide the first discussion; the tailor can recommend changes after seeing your proportions and the selected cloth.</p>
                <div className="mt-8 space-y-8">
                  <ChoiceGroup label="Preferred fit" value={form.fit} options={fitOptions} onChange={(value) => update('fit', value)} />
                  <ChoiceGroup label="Style direction" value={form.styleDirection} options={styleOptions} onChange={(value) => update('styleDirection', value)} />
                  <ChoiceGroup label="Personalisation" value={form.personalization} options={personalizationOptions} onChange={(value) => update('personalization', value)} />
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <p className="eyebrow">STEP 4</p>
                <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Where should we meet?</h2>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {['At Studio', 'Virtual Consultation'].map((location) => (
                    <button key={location} onClick={() => update('location', location)} className={`focus-lux min-h-28 border p-5 text-left transition-colors ${form.location === location ? 'border-ink bg-ink text-white' : 'border-black/15 bg-white/20 hover:border-gold'}`}>
                      <strong className="font-medium">{location}</strong>
                      <p className="mt-2 text-xs leading-5 opacity-65">{location === 'At Studio' ? 'Private fitting in Pokhara with physical fabric and measurement review.' : 'Useful for an initial discussion; production still requires accurate physical measurements.'}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="max-w-lg">
                <p className="eyebrow">STEP 5</p>
                <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Choose a preferred date.</h2>
                <label className="mt-7 block text-xs uppercase tracking-[.14em] text-muted">Appointment date
                  <input type="date" value={form.date || ''} min={new Date().toISOString().split('T')[0]} onChange={(e) => update('date', e.target.value)} className="mt-2"/>
                </label>
                <p className="mt-4 text-xs leading-5 text-muted">The studio reviews this request before the time is finally confirmed.</p>
              </div>
            )}

            {step === 5 && (
              <div>
                <p className="eyebrow">STEP 6</p>
                <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Select a preferred time.</h2>
                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {times.map((time) => <button key={time} onClick={() => update('time', time)} className={`focus-lux border p-4 text-sm transition-colors ${form.time === time ? 'border-ink bg-ink text-white' : 'border-black/15 bg-white/20 hover:border-gold'}`}>{time}</button>)}
                </div>
              </div>
            )}

            {step === 6 && (
              <div>
                <p className="eyebrow">STEP 7</p>
                <h2 className="mt-3 font-serif text-4xl sm:text-5xl">A few details about you.</h2>
                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  <label className="text-xs text-muted">Full name<input value={form.name || ''} onChange={(e) => update('name', e.target.value)} className="mt-2"/></label>
                  <label className="text-xs text-muted">Phone · 10 digits<input inputMode="numeric" pattern="[0-9]{10}" maxLength="10" value={form.phone || ''} onChange={(e) => update('phone', digitsOnly(e.target.value))} placeholder="98XXXXXXXX" className="mt-2"/><span className="mt-1 block text-[10px] text-muted/70">Enter exactly 10 digits.</span></label>
                  <label className="text-xs text-muted">Email<input type="email" value={form.email || ''} onChange={(e) => update('email', e.target.value)} className="mt-2"/></label>
                  <label className="text-xs text-muted">Preferred contact<select value={form.contact || 'Phone'} onChange={(e) => update('contact', e.target.value)} className="mt-2"><option>Phone</option><option>WhatsApp</option><option>Email</option></select></label>
                </div>
              </div>
            )}

            {step === 7 && (
              <div>
                <p className="eyebrow">STEP 8</p>
                <h2 className="mt-3 font-serif text-4xl sm:text-5xl">What should we know before you arrive?</h2>
                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  <label className="text-xs text-muted">Occasion<input value={form.occasion || ''} onChange={(e) => update('occasion', e.target.value)} className="mt-2" placeholder="Wedding, office, reception..."/></label>
                  <label className="text-xs text-muted">Event date<input type="date" value={form.eventDate || ''} onChange={(e) => update('eventDate', e.target.value)} className="mt-2"/></label>
                  <label className="text-xs text-muted sm:col-span-2">Extra tailoring notes<textarea rows="5" value={form.notes || ''} onChange={(e) => update('notes', e.target.value)} className="mt-2" placeholder="Lapel, collar, cuff, trouser, lining, pocket, button, colour or reference-style preferences."/></label>
                </div>
              </div>
            )}

            {step === 8 && (
              <div>
                <p className="eyebrow">STEP 9</p>
                <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Review your tailoring request.</h2>
                {(selectedProduct || selectedFabric) && (
                  <div className="mt-7 grid gap-4 sm:grid-cols-2">
                    {selectedProduct && <div className="border border-black/10 bg-white/25 p-4"><img src={selectedProduct.image} alt={selectedProduct.name} className="aspect-[4/3] w-full object-contain"/><p className="mt-3 text-xs text-muted">Garment</p><p className="mt-1 font-serif text-xl">{selectedProduct.name}</p></div>}
                    {selectedFabric && <div className="border border-black/10 bg-white/25 p-4"><img src={selectedFabric.image} alt={selectedFabric.name} className="aspect-[4/3] w-full object-cover"/><p className="mt-3 text-xs text-muted">Fabric</p><p className="mt-1 font-serif text-xl">{selectedFabric.name}</p></div>}
                  </div>
                )}
                <div className="mt-7 divide-y divide-black/10 border-y border-black/15">
                  {[
                    ['Garment', form.product],
                    ['Service', form.service || 'Tailoring'],
                    ['Fabric', form.fabric],
                    ['Fit', form.fit],
                    ['Style', form.styleDirection],
                    ['Personalisation', form.personalization],
                    ['Location', form.location],
                    ['Date', form.date],
                    ['Time', form.time],
                    ['Name', form.name],
                    ['Phone', form.phone],
                    ['Email', form.email],
                    ['Occasion', form.occasion || '—'],
                    ['Event Date', form.eventDate || '—'],
                    ['Notes', form.notes || '—'],
                  ].map(([key, value]) => <div key={key} className="grid grid-cols-[130px_1fr] gap-4 py-4 text-sm"><span className="text-muted">{key}</span><span>{value}</span></div>)}
                </div>
                <Button onClick={submit} className="mt-7">{isEditing ? 'Save Changes' : 'Send Fitting Request'}</Button>
              </div>
            )}

            <div className="mt-10 flex justify-between border-t border-black/15 pt-6">
              <Button disabled={step === 0} onClick={() => setStep(Math.max(0, step - 1))} variant="outline" className={step === 0 ? 'invisible' : ''}><ChevronLeft size={15}/> Back</Button>
              {step < 8 && <Button disabled={!canNext} onClick={() => canNext && setStep(step + 1)} className={!canNext ? 'opacity-40' : ''}>Continue <ChevronRight size={15}/></Button>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChoiceGroup({ label, value, options, onChange }) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-[.16em] text-muted">{label}</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {options.map((option) => <button key={option} type="button" onClick={() => onChange(option)} className={`border px-4 py-4 text-left text-sm transition ${value === option ? 'border-ink bg-ink text-white' : 'border-black/15 bg-white/20 hover:border-gold'}`}>{option}</button>)}
      </div>
    </div>
  );
}
