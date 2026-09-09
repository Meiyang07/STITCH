import { Check, ChevronLeft, ChevronRight, Clock3, MapPin, MessageCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import Button from '../components/common/Button';
import SectionHeader from '../components/common/SectionHeader';
import useLocalStorage from '../hooks/useLocalStorage';

const services = ['Bespoke Suit', 'Wedding Suit', 'Shirt', 'Tuxedo', 'Traditional Wear', 'Alteration', 'Style Consultation'];
const times = ['10:00 AM', '11:30 AM', '1:00 PM', '2:30 PM', '4:00 PM', '5:30 PM'];
const steps = ['Service', 'Location', 'Date', 'Time', 'Details', 'Notes', 'Review'];
const defaultForm = { service: '', location: 'At Studio', date: '', time: '', name: '', phone: '', email: '', contact: 'Phone', occasion: '', eventDate: '', notes: '' };

export default function Appointment() {
  const [form, setForm] = useLocalStorage('stitch_appointment_draft', defaultForm);
  const [step, setStep] = useState(0);
  const [confirmed, setConfirmed] = useState(false);

  const canNext = useMemo(() => {
    if (step === 0) return !!form.service;
    if (step === 1) return !!form.location;
    if (step === 2) return !!form.date;
    if (step === 3) return !!form.time;
    if (step === 4) return form.name && form.phone && form.email.includes('@');
    return true;
  }, [step, form]);

  const update = (key, value) => setForm({ ...form, [key]: value });
  const submit = () => {
    localStorage.setItem('stitch_booking', JSON.stringify({ ...form, createdAt: new Date().toISOString() }));
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <section className="flex min-h-[78vh] items-center pb-20 pt-32">
        <div className="container-lux">
          <div className="mx-auto max-w-2xl border border-black/10 bg-[#FAF8F3] p-8 text-center shadow-soft sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold text-gold"><Check /></div>
            <p className="eyebrow mt-7">REQUEST SAVED</p>
            <h1 className="mt-4 font-serif text-5xl">Your fitting details are ready.</h1>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-muted">
              This prototype stores the request on this device. Connect the form to your studio email, CRM or booking service before publishing it for real customers.
            </p>
            <div className="mt-8 border-y border-black/15 py-6 text-left text-sm">
              <p><strong>{form.service}</strong> · {form.location}</p>
              <p className="mt-2 text-muted">{form.date} at {form.time}</p>
              <p className="mt-2 text-muted">{form.name} · {form.phone}</p>
            </div>
            <Button onClick={() => { setConfirmed(false); setStep(0); }} variant="outline" className="mt-7">Make Another Request</Button>
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
          title="Book an appointment"
          copy="Choose the service, preferred date and time, then tell us enough about the occasion to make the first conversation useful."
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-14">
          <aside className="h-fit border-t border-black/15 pt-6 lg:sticky lg:top-28">
            <p className="text-[9px] uppercase tracking-[.2em] text-gold">YOUR VISIT</p>
            <div className="mt-5 space-y-4 text-sm text-muted">
              <p className="flex items-start gap-3"><MapPin size={16} className="mt-0.5 text-ink"/> Pokhara studio or virtual consultation</p>
              <p className="flex items-start gap-3"><Clock3 size={16} className="mt-0.5 text-ink"/> Preferred times are reviewed before confirmation</p>
              <p className="flex items-start gap-3"><MessageCircle size={16} className="mt-0.5 text-ink"/> Choose phone, WhatsApp or email for follow-up</p>
            </div>

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
                <h2 className="mt-3 font-serif text-4xl sm:text-5xl">What are we tailoring?</h2>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {services.map((service) => (
                    <button key={service} onClick={() => update('service', service)} className={`focus-lux border p-5 text-left text-sm transition-colors ${form.service === service ? 'border-ink bg-ink text-white' : 'border-black/15 bg-white/20 hover:border-gold'}`}>{service}</button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <p className="eyebrow">STEP 2</p>
                <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Where should we meet?</h2>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {['At Studio', 'Virtual Consultation'].map((location) => (
                    <button key={location} onClick={() => update('location', location)} className={`focus-lux min-h-28 border p-5 text-left transition-colors ${form.location === location ? 'border-ink bg-ink text-white' : 'border-black/15 bg-white/20 hover:border-gold'}`}>
                      <strong className="font-medium">{location}</strong>
                      <p className="mt-2 text-xs leading-5 opacity-65">{location === 'At Studio' ? 'Private fitting in Pokhara.' : 'Useful for an initial discussion; production still requires accurate physical measurements.'}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="max-w-lg">
                <p className="eyebrow">STEP 3</p>
                <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Choose a preferred date.</h2>
                <label className="mt-7 block text-xs uppercase tracking-[.14em] text-muted">Appointment date
                  <input type="date" value={form.date} min={new Date().toISOString().split('T')[0]} onChange={(e) => update('date', e.target.value)} className="mt-2"/>
                </label>
                <p className="mt-4 text-xs leading-5 text-muted">Live studio availability is not connected in this prototype.</p>
              </div>
            )}

            {step === 3 && (
              <div>
                <p className="eyebrow">STEP 4</p>
                <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Select a preferred time.</h2>
                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {times.map((time) => <button key={time} onClick={() => update('time', time)} className={`focus-lux border p-4 text-sm transition-colors ${form.time === time ? 'border-ink bg-ink text-white' : 'border-black/15 bg-white/20 hover:border-gold'}`}>{time}</button>)}
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <p className="eyebrow">STEP 5</p>
                <h2 className="mt-3 font-serif text-4xl sm:text-5xl">A few details about you.</h2>
                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  <label className="text-xs text-muted">Full name<input value={form.name} onChange={(e) => update('name', e.target.value)} className="mt-2"/></label>
                  <label className="text-xs text-muted">Phone<input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+977" className="mt-2"/></label>
                  <label className="text-xs text-muted">Email<input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="mt-2"/></label>
                  <label className="text-xs text-muted">Preferred contact<select value={form.contact} onChange={(e) => update('contact', e.target.value)} className="mt-2"><option>Phone</option><option>WhatsApp</option><option>Email</option></select></label>
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <p className="eyebrow">STEP 6</p>
                <h2 className="mt-3 font-serif text-4xl sm:text-5xl">What should we know before you arrive?</h2>
                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  <label className="text-xs text-muted">Occasion<input value={form.occasion} onChange={(e) => update('occasion', e.target.value)} className="mt-2"/></label>
                  <label className="text-xs text-muted">Event date<input type="date" value={form.eventDate} onChange={(e) => update('eventDate', e.target.value)} className="mt-2"/></label>
                  <label className="text-xs text-muted sm:col-span-2">Notes<textarea rows="5" value={form.notes} onChange={(e) => update('notes', e.target.value)} className="mt-2" placeholder="Preferred style, colour, dress code, fit concerns or anything else that will help the consultation."/></label>
                </div>
              </div>
            )}

            {step === 6 && (
              <div>
                <p className="eyebrow">STEP 7</p>
                <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Review your request.</h2>
                <div className="mt-7 divide-y divide-black/10 border-y border-black/15">
                  {[
                    ['Service', form.service], ['Location', form.location], ['Date', form.date], ['Time', form.time], ['Name', form.name], ['Phone', form.phone], ['Email', form.email], ['Occasion', form.occasion || '—'], ['Event Date', form.eventDate || '—'], ['Notes', form.notes || '—'],
                  ].map(([key, value]) => <div key={key} className="grid grid-cols-[120px_1fr] gap-4 py-4 text-sm"><span className="text-muted">{key}</span><span>{value}</span></div>)}
                </div>
                <Button onClick={submit} className="mt-7">Save Appointment Request</Button>
              </div>
            )}

            <div className="mt-10 flex justify-between border-t border-black/15 pt-6">
              <Button disabled={step === 0} onClick={() => setStep(Math.max(0, step - 1))} variant="outline" className={step === 0 ? 'invisible' : ''}><ChevronLeft size={15}/> Back</Button>
              {step < 6 && <Button disabled={!canNext} onClick={() => canNext && setStep(step + 1)} className={!canNext ? 'opacity-40' : ''}>Continue <ChevronRight size={15}/></Button>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
